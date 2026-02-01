import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Order } from '../hooks/useOrdersMutations.ts';

type ShippingLabelModalProps = {
  isOpen: boolean;
  order: Order | null;
  packageCount: number;
  onClose: () => void;
};

const ShippingLabelModal = ({ isOpen, order, packageCount, onClose }: ShippingLabelModalProps) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !order) return null;

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} | ${hours}:${minutes}`;
  };

  const orderId = order.orderId !== undefined ? String(order.orderId) : (order.orderNumber || order.id);
  const totalPackages = packageCount || 1;
  const labels = Array.from({ length: totalPackages }, (_, i) => i + 1);

  const handleGeneratePDF = async () => {
    const content = pdfContentRef.current;
    if (!content) return;

    setIsGenerating(true);

    try {
      // A5 landscape dimensions in mm
      const pageWidth = 210;
      const pageHeight = 148;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
      });

      const pageElements = content.querySelectorAll('.pdf-page');

      for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i] as HTMLElement;

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        if (i > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      }

      // Open PDF in new tab
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const pages: number[][] = [];
  for (let i = 0; i < labels.length; i += 2) {
    pages.push(labels.slice(i, i + 2));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Vista previa de etiquetas - Orden {orderId}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="space-y-4">
            {pages.map((pageLabels, pageIndex) => (
              <div
                key={pageIndex}
                className="bg-white mx-auto shadow-lg"
                style={{ width: "620px", height: "420px", display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}
              >
                {pageLabels.map((pkgNum) => (
                  <div
                    key={pkgNum}
                    className="border-2 border-black flex flex-col overflow-hidden rounded-3xl"
                    style={{ width: "297px", height: "420px" }}
                  >
                    <div className="flex border-b-2 border-black">
                      <div className="w-2/5 flex items-center justify-center border-r-2 border-black p-2">
                        <img
                          alt="Logo ÚtilesYa"
                          className="w-20 object-contain"
                          src="/imagenes/logo-negro-100x100.png"
                        />
                      </div>
                      <div className="w-3/5 p-3">
                        <p className="font-extrabold text-xs">De:</p>
                        <p className="text-xs">ÚtilesYa</p>
                        <p className="text-xs">Montevideo / Uruguay</p>
                        <p className="text-xs">Teléfono 097098751</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 border-b-2 border-black leading-tight">
                      <p className="font-extrabold text-sm">Para:</p>
                      <p className="text-lg font-black leading-tight">
                        {order.customerName || "-"}
                      </p>
                      <p className="text-sm leading-snug">
                        {order.customerAddress || "-"}
                      </p>
                      <p className="text-sm leading-snug">
                        Montevideo | Uruguay
                      </p>
                      <p className="text-sm leading-snug">Teléfono: </p>
                    </div>
                    <div className="flex border-b-2 border-black">
                      <div className="w-1/2 px-3 py-2 border-r-2 border-black">
                        <div className="mb-2">
                          <p className="font-extrabold text-xs">OrdenId:</p>
                          <p className="text-xs">{orderId}</p>
                        </div>
                        <div>
                          <p className="font-extrabold text-xs">
                            Fecha de orden:
                          </p>
                          <p className="text-xs">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="w-1/2 ps-3 py-2">
                        <div className="mb-2">
                          <p className="font-extrabold text-xs">
                            Cantidad de bultos:
                          </p>
                          <p className="text-xs">{totalPackages}</p>
                        </div>
                        <div>
                          <p className="font-extrabold text-xs">
                            Número de paquete:
                          </p>
                          <p className="text-xs">
                            {pkgNum}/{totalPackages}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-2">
                      <img
                        alt="QR Code"
                        className="w-24 h-24 object-contain"
                        src="/imagenes/qr.png"
                      />
                    </div>
                  </div>
                ))}
                {pageLabels.length === 1 && (
                  <div
                    style={{ width: "297px", height: "420px" }}
                    className="border-2 border-dashed border-gray-300"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hidden content for PDF generation */}
        <div ref={pdfContentRef} className="absolute left-[-9999px] top-0">
          {pages.map((pageLabels, pageIndex) => (
            <div
              key={pageIndex}
              className="pdf-page bg-white"
              style={{
                width: "794px",
                height: "559px",
                display: "flex",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "system-ui, -apple-system, sans-serif"
              }}
            >
              {pageLabels.map((pkgNum) => (
                <div
                  key={pkgNum}
                  className="flex flex-col"
                  style={{
                    width: "397px",
                    height: "559px",
                    border: "2px solid black",
                    borderRadius: "24px",
                    overflow: "hidden"
                  }}
                >
                  <div className="flex" style={{ borderBottom: "2px solid black" }}>
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "40%",
                        borderRight: "2px solid black",
                        padding: "12px"
                      }}
                    >
                      <img
                        alt="Logo ÚtilesYa"
                        style={{ width: "100px" }}
                        src="/imagenes/logo-negro-100x100.png"
                      />
                    </div>
                    <div style={{ width: "60%", padding: "12px 16px" }}>
                      <p style={{ fontWeight: 800, fontSize: "14px" }}>De:</p>
                      <p style={{ fontSize: "14px" }}>ÚtilesYa</p>
                      <p style={{ fontSize: "14px" }}>Montevideo / Uruguay</p>
                      <p style={{ fontSize: "14px" }}>Teléfono 097098751</p>
                    </div>
                  </div>
                  <div style={{ padding: "2px 16px 12px 16px", borderBottom: "2px solid black" }}>
                    <p style={{ fontWeight: 800, fontSize: "16px", marginBottom: "-2px" }}>Para:</p>
                    <p style={{ fontSize: "22px", fontWeight: 900, lineHeight: 1.1, marginBottom: "6px" }}>
                      {order.customerName || "-"}
                    </p>
                    <p style={{ fontSize: "14px", lineHeight: 1.3 }}>
                      {order.customerAddress || "-"}
                    </p>
                    <p style={{ fontSize: "14px", lineHeight: 1.3 }}>
                      Montevideo | Uruguay
                    </p>
                    <p style={{ fontSize: "14px", lineHeight: 1.3, marginBottom: "4px" }}>Teléfono: </p>
                  </div>
                  <div className="flex" style={{ borderBottom: "2px solid black" }}>
                    <div style={{ width: "50%", padding: "10px 16px", borderRight: "2px solid black" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <p style={{ fontWeight: 800, fontSize: "13px" }}>OrdenId:</p>
                        <p style={{ fontSize: "13px" }}>{orderId}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: "13px" }}>Fecha de orden:</p>
                        <p style={{ fontSize: "13px" }}>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div style={{ width: "50%", padding: "10px 16px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <p style={{ fontWeight: 800, fontSize: "13px" }}>Cantidad de bultos:</p>
                        <p style={{ fontSize: "13px" }}>{totalPackages}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 800, fontSize: "13px" }}>Número de paquete:</p>
                        <p style={{ fontSize: "13px" }}>{pkgNum}/{totalPackages}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center"
                    style={{ flex: 1, padding: "12px" }}
                  >
                    <img
                      alt="QR Code"
                      style={{ width: "120px", height: "120px" }}
                      src="/imagenes/qr.png"
                    />
                  </div>
                </div>
              ))}
              {pageLabels.length === 1 && (
                <div style={{ width: "397px", height: "559px" }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">
              {isGenerating ? 'hourglass_empty' : 'picture_as_pdf'}
            </span>
            {isGenerating ? 'Generando...' : 'Generar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabelModal;
