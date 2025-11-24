import { Client } from 'basic-ftp';
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const client = new Client();
    client.ftp.verbose = true;

    const body = await req.json();
    const { fileName, content } = body;

    await client.access({
      host: 'ftp.rakuten.ne.jp',
      port: 16910,
      user: 'auc-ronnefeldt',
      password: 'Ronne@04',
      secure: false,
    });

    // 1️⃣ Upload HTML từ Next.js
    await client.ensureDir('/public_html/tools/103');
    const buffer = Buffer.from(content, 'utf-8');
    const stream = Readable.from(buffer);
    await client.uploadFrom(stream, fileName);
    console.log('aa');
    // 2️⃣ Upload folder CSS/JS/IMG từ public/template_html/tools/103
    const publicFolder = path.join(process.cwd(), 'public', 'template_html', 'tools', '103');
    const foldersToUpload = ['header_css', 'header_js', 'img']; // chỉ upload các folder này

    for (const folderName of foldersToUpload) {
      const localFolderPath = path.join(publicFolder, folderName);
      const remoteFolderPath = `/public_html/tools/103/${folderName}`;

      if (fs.existsSync(localFolderPath)) {
        await uploadFolderRecursive(client, localFolderPath, remoteFolderPath);
      }
    }

    const list = await client.list('/public_html/tools/103');
    const uploadedFile = list.find((f) => f.name === fileName);
    client.close();

    client.close();

    if (uploadedFile) {
      return NextResponse.json({ success: true, message: 'Upload HTML + CSS/JS/IMG success' });
    } else {
      return NextResponse.json({ success: false, message: 'Upload fail' });
    }
  } catch (err: any) {
    console.log('FTP Upload Error:', err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

async function uploadFolderRecursive(client: Client, localFolder: string, remoteFolder: string) {
  await client.ensureDir(remoteFolder);

  const items = fs.readdirSync(localFolder);

  for (const item of items) {
    const localPath = path.join(localFolder, item);
    const remotePath = path.posix.join(remoteFolder, item);
    const stats = fs.statSync(localPath);

    if (stats.isFile()) {
      await client.uploadFrom(localPath, remotePath);
    } else if (stats.isDirectory()) {
      await uploadFolderRecursive(client, localPath, remotePath);
    }
  }

  // quay về folder cha
  await client.cdup();
}
