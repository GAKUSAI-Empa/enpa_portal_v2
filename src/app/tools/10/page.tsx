"use client";

import React, { useId, useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../component/common/Card";
import { Button } from "../../../component/common/Button";
import { Table } from "../../../component/common/Table";
import { TextBox } from "../../../component/common/TextBox";
import SelectBox from "../../../component/common/SelectBox";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { cn } from "../../../lib/utils";


// --- Dữ liệu cho template ---
const templates = [
  {
    id: 1,
    name: "テンプレート1",
    imgs: "/img/tool10/Coupon_No_1.jpg",
  },
  {
    id: 2,
    name: "テンプレート2",
 imgs: "/img/tool10/Coupon_No_4.jpg",
  },
  {
    id: 3,
    name: "テンプレート3",
 imgs: "/img/tool10/Coupon_No_5.jpg",
  },
  {
    id: 4,
    name: "テンプレート4",
    imgs: "/img/tool10/Coupon_No_8.jpg",
  },
  {
    id: 5,
    name: "テンプレート5",
 imgs: "/img/tool10/Coupon_No_9.jpg", },
  {
    id: 6,
    name: "テンプレート6",
 imgs: "/img/tool10/Coupon_No_12.jpg",  },
    {
    id: 7,
    name: "テンプレート7",
 imgs: "/img/tool10/Coupon_No_13.jpg",  },
    {
    id: 8,
    name: "テンプレート8",
 imgs: "/img/tool10/Coupon_No_16.jpg",  },
    {
    id: 9,
    name: "テンプレート9",
 imgs: "/img/tool10/Coupon_No_17.jpg",  },
    {
    id: 10,
    name: "テンプレート10",
 imgs: "/img/tool10/Coupon_No_20.jpg",  },
    {
    id: 11,
    name: "テンプレート11",
 imgs: "/img/tool10/Coupon_No_21.jpg",  },
    {
    id: 12,
    name: "テンプレート12",
 imgs: "/img/tool10/Coupon_No_26.jpg",  },
    {
    id: 13,
    name: "テンプレート13",
 imgs: "/img/tool10/Coupon_No_27.jpg",  },
    {
    id: 14,
    name: "テンプレート14",
 imgs: "/img/tool10/Coupon_No_30.jpg",  },
    {
    id: 15,
    name: "テンプレート15",
 imgs: "/img/tool10/Coupon_No_31.jpg",  },
    {
    id: 16,
    name: "テンプレート16",
 imgs: "/img/tool10/Coupon_No_34.jpg",  },
];


// --- テーブル定義 ---;
type ProductRow = {
  id: string;
  template: string;
  couponText1: string;
  couponText2: string;
  discount : string;
  discountType: "percent" | "yen" | "";
  conditions: string;
  startDate: string;
  endDate: string;
};

// --- ミス定義 ---;
type RowErrors = {
  startDate?: string;
  endDate?: string;
  discount?: string;
  couponText1?: string;
  couponText2?: string;
};

type AllErrors = { [key: string]: RowErrors };

// --- 新規な行 ---;

const createNewRow = (id : string) : ProductRow => ({
    id: `${id} - ${Date.now()}`,
    template : templates[0].name,
    couponText1 : '',
    couponText2 : '',
    discount : '',
    discountType: "percent",
    conditions : '',
    startDate : "",
    endDate : "",
})
// --- Component hiển thị lỗi ---
const ErrorDisplay = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="group relative flex items-center pr-2">
      <IconAlertCircle size={16} className="text-red-500 cursor-pointer" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {message}
      </div>
    </div>
  );
};




// --- Component Bảng Nhập Liệu ---
interface EditableProductTableProps {
  rows: ProductRow[];
  setRows: React.Dispatch<React.SetStateAction<ProductRow[]>>;
  errors: AllErrors;
  showErrors: boolean;
}

function EditableProductTable({
  rows,
  setRows,
  errors,
  showErrors,
}: EditableProductTableProps) {
  const baseId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    id: string,
    field: keyof ProductRow,
    value: string
  ) => {
    let processedValue: string | number = value;
    if (field === 'discount') {
      // Allow only numbers and a single dot
      processedValue = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    }

    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const updatedRow = { ...row, [field]: processedValue };
        return updatedRow;
      })
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createNewRow(baseId)]);
  };
  const addMultipleRows = (count: number) => {
    const newRows = Array.from({ length: count }, (_, i) =>
      createNewRow(`${baseId}-${i}`)
    );
    setRows((prev) => [...prev, ...newRows]);
  };

  const deleteRow = (id: string) => {
    setRows((prev) => {
      if (prev.length > 1) {
        return prev.filter((row) => row.id !== id);
      }
      return prev;
    });
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const parseJapaneseDate = (dateStr: string): string => {
    if (!dateStr || !dateStr.includes("月")) return "";
    const match = dateStr.match(/(\d{1,2})月\s*(\d{1,2})日\s*(\d{1,2})[:時](\d{1,2})/);
    if (!match) return "";
    const [, month, day, hour, minute] = match.map(Number);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const year = month < currentMonth ? currentYear + 1 : currentYear;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    return `${year}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const lines = text.trim().split(/\r\n|\n/);
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const headerMapping: { [key: string]: keyof ProductRow | string } = {
        テンプレート: "template",
        クーポン文言１: "couponText1",
        クーポン文言２: "couponText2",
        '割引(値)': "discount",
        '割引(単位)': "discountType",
        使用可能条件: "conditions",
        開始日時: "startDate",
        終了日時: "endDate",
      };

      const newRows: ProductRow[] = lines
        .slice(1)
        .map((line, lineIndex) => {
          const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
          const rowData = createNewRow(`${baseId}-csv-${lineIndex}`);
          headers.forEach((header, index) => {
            const key = headerMapping[header];
            const value = values[index];
            if (!key || value === undefined) return;
           if (
              [
                "startDate",
                "endDate",
              ].includes(key as string)
            ) {
              (rowData as any)[key] = parseJapaneseDate(value);
            } else if (key === "discountType") {
              rowData.discountType = value === "円" ? "yen" : "percent";
            } else {
              (rowData as any)[key] = value;
            }
          });
          return rowData;
        })
        .filter((row) => row.template);
      if (newRows.length > 0) {
          setRows((prev) => [...prev, ...newRows]);
      }
      else alert("CSVファイルの読み込みに失敗したか、内容が空です。");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      alert("ファイルの読み込み中にエラーが発生しました。");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file, "Shift_JIS");
  };

  if (rows.length === 0) return null;

  const singleInputStyle =
    "w-full h-full !p-2 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredInputStyle =
    "w-full h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";
  const tieredInputFlexStyle =
    "flex-grow h-8 !p-1 !border-0 !rounded-none focus:!ring-1 focus:!ring-inset focus:!ring-primary";

  return (
    <Card>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: "none" }}
      />
      <CardHeader
        title="2. 商品情報入力"
        description='は必須項目です。'
        buttonGroup={
          <>
            <Button color="secondary" onClick={() => addRow()}>行を追加</Button>
            <Button color="secondary" onClick={() => addMultipleRows(5)}>5行を追加</Button>
            <Button color="grey" onClick={() => handleImportCSV()}>CSVで一括取り込む</Button>
          </>
        }
      />
      <CardContent className="pb-8">
        <Table.Root className="w-full table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Th width="w-[3%]" center>
                #
              </Table.Th>
              <Table.Th width="w-[12%]">テンプレート</Table.Th>
              <Table.Th width="w-[20%]">クーポン文言１</Table.Th>
              <Table.Th width="w-[20%]">クーポン文言2</Table.Th>
              <Table.Th width="w-[7%]">
                割引 <br />（値）<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[3%]">
                割引 <br />（単位）<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[15%]">
                使用可能条件<span className="text-red-500">*</span>
              </Table.Th>
              <Table.Th width="w-[13%]">
                開始日時
              </Table.Th>
              <Table.Th width="w-[13%]">
                終了日時
              </Table.Th>
              <Table.Th width="w-[3%]" center>
                削除
              </Table.Th>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map((row, index) => {
              const rowErrors = errors[row.id] || {};
              const hasError = (fieldName: keyof RowErrors) =>
                showErrors && rowErrors[fieldName];
              return (
                <Table.Row key={row.id}>
                  <Table.Td center className="p-2 align-middle">
                    {index + 1}
                  </Table.Td>
                  <Table.Td className="p-0 align-middle">
                    <SelectBox
                      label=""
                      id={`template-${row.id}`}
                      className={cn(singleInputStyle, "truncate")}
                      style={{margin : "0 8px"}}
                      options={templates.map((t) => ({
                        value: t.name,
                        label: t.name,
                      }))}
                      value={row.template ?? templates[0].name}
                      onChange={(e) =>
                        handleInputChange(row.id, "template", e.target.value)
                      }
                    />
                  </Table.Td>

                  {/* //template */}

                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("couponText1") && "border border-red-500"
                      )}
                    >
                      <TextBox
                        label=""
                        id={`couponText1-${row.id}`}
                        name={`couponText1-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.couponText1 ?? ""}
                        onChange={(e) =>
                          handleInputChange(row.id, "couponText1", e.target.value)
                        }
                      />
                      {hasError("couponText1") && (
                        <ErrorDisplay message={rowErrors.couponText1} />
                      )}
                    </div>
                  </Table.Td>



                  <Table.Td className="p-0 align-middle">
                    <div
                      className={cn(
                        "flex items-center w-full h-full",
                        hasError("couponText2") && "border border-red-500"
                      )}
                    >
                      <TextBox
                        label=""
                        id={`couponText2-${row.id}`}
                        name={`couponText2-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.couponText2}
                        onChange={(e) =>
                          handleInputChange(row.id, "couponText2", e.target.value)
                        }
                      />
                      {hasError("couponText2") && (
                        <ErrorDisplay message={rowErrors.couponText2} />
                      )}
                    </div>
                  </Table.Td>                  

                  <Table.Td>
                    <TextBox
                      label=""
                      id={`discount-${row.id}`}
                      name={`discount-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        "text-center bg-gray-100 truncate w-full"
                      )}
                      value={row.discount}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "discount",
                          e.target.value
                        )}
                    />
                    </Table.Td>

                  <Table.Td>
                    <SelectBox
                      label=""
                      id={`discountType-${row.id}`}
                      className={cn(
                        tieredInputStyle,
                        "text-center truncate border-b border-gray-300",
                      )}
                     style={{width : "5rem"}}
                      options={[
                        { value: "percent", label: "%" },
                        { value: "yen", label: "円" },
                      ]}
                      value={row.discountType}
                      onChange={(e) =>
                        handleInputChange(
                          row.id,
                          "discountType",
                          e.target.value
                        )
                      }
                    />
                  </Table.Td>

                  <Table.Td className="p-0 align-middle">
                    <div
                      // className={cn(
                      //   "flex items-center w-full h-full",
                      //   hasError("conditions") && "border border-red-500"
                      // )}
                    >
                      <TextBox
                        label=""
                        id={`conditions-${row.id}`}
                        name={`conditions-${row.id}`}
                        placeholder="文言を入力"
                        className={cn(singleInputStyle, "text-center truncate")}
                        value={row.conditions}
                        onChange={(e) =>
                          handleInputChange(row.id, "conditions", e.target.value)
                        }
                      />
                      {/* {hasError("conditions") && (
                        <ErrorDisplay message={rowErrors.couponText2} />
                      )} */}
                    </div>
                  </Table.Td>

                  
                  <Table.Td>
                    {/* 開始日時 */}
                    <div className="w-full">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`startDate-${row.id}`}
                        name={`startDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
                          hasError("startDate") && "border border-red-500"
                        )}
                        value={row.startDate}
                        onChange={(e) =>
                          handleInputChange(row.id, "startDate", e.target.value)
                        }
                      />
                      {hasError("startDate") && (
                        <ErrorDisplay message={rowErrors.startDate} />
                      )}
                    </div>
                    </Table.Td>
                    <Table.Td>

                    {/* 終了日時 */}
                    <div className="w-full">
                      <TextBox
                        type="datetime-local"
                        label=""
                        id={`endDate-${row.id}`}
                        name={`endDate-${row.id}`}
                        className={cn(
                          tieredInputStyle,
                          "truncate w-full",
                          hasError("endDate") && "border border-red-500"
                        )}
                        value={row.endDate}
                        onChange={(e) =>
                          handleInputChange(row.id, "endDate", e.target.value)
                        }
                      />
                      {hasError("endDate") && (
                        <ErrorDisplay message={rowErrors.endDate} />
                      )}
                    </div>
                  </Table.Td>

                  <Table.Td center className="p-1 align-middle">
                    <button
                      onClick={() => deleteRow(row.id)}
                      className={`p-1 ${rows.length > 1
                        ? "text-gray-400 hover:text-red-600"
                        : "text-gray-200 cursor-not-allowed"
                        }`}
                      disabled={rows.length <= 1}
                    >
                      <IconTrash size={20} />
                    </button>
                  </Table.Td>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </CardContent>
    </Card>
  );
}


// --- Component Trang chính ---
export default function TwoPriceImagePage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string | null>(null);
  const [errors, setErrors] = useState<AllErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);

  useEffect(() => {
    setIsClient(true);
    setProductRows([createNewRow("initial-page-load")]);
  }, []);
const validateRows = (rows: ProductRow[]) => {
  const newErrors: AllErrors = {};

  rows.forEach((row) => {
    const rowErrors: RowErrors = {};
    if (!row.startDate) rowErrors.startDate = "必須項目です。";
    if (!row.endDate) rowErrors.endDate = "必須項目です。";
    if (!row.discount) {
      rowErrors.discount = "必須項目です。";
    } else if (isNaN(parseFloat(row.discount))) {
      rowErrors.discount = "数値を入力してください。";
    }

    if (Object.keys(rowErrors).length > 0) {
      newErrors[row.id] = rowErrors;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handlePreviewClick = () => {
  setShowErrors(true);
  const isValid = validateRows(productRows);

  if (!isValid) {
    alert("入力内容にエラーがあります。確認してください。");
    return;
  }

  setShowErrors(false);
  alert("プレビュー機能は開発中です。");
};

  
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">クーポン画像作成二重価格画像作成</h1>
        <Card>
          <CardHeader title="1. テンプレート" />
          <CardContent>
            <div className="relative">
              <div className="flex items-start gap-4 overflow-x-auto pb-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex-shrink-0 text-center w-auto"
                  >
                    <div
                      className="flex items-start gap-2 cursor-pointer"
                      onClick={() => setSelectedImages(template.imgs)}
                    >
  
                        <img
                          src={ `${template.imgs}` }
                          alt={`${template.name}`}
                          className="w-36 h-36 object-cover rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                        />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      {template.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
  
        {isClient && (
          <EditableProductTable
            rows={productRows}
            setRows={setProductRows}
            errors={errors}
            showErrors={showErrors}
          />
        )}
  
        <div className="flex justify-center pt-4">
          <Button color="primary" onClick={handlePreviewClick}>
            プレビュー
          </Button>
        </div>
  
        {selectedImages && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImages(null)}
          >
            <div
              className="flex flex-col md:flex-row items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
        <img
        src={selectedImages}
        alt="Template Preview" 
        className="max-w-[45vw] max-h-[80vh] object-contain rounded-md"
      />
            </div>
          </div>
        )}
      </div>
    );
  }
  