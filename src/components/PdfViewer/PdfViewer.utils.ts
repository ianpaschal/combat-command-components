export async function download(
  file?: string | File | ArrayBuffer | null,
  fileName: string = 'document',
): Promise<void> {
  let url: string | undefined;
  try {
    let blob: Blob;
    if (!file) {
      return;
    }
    if (file instanceof File) {
      blob = file;
    } else if (file instanceof ArrayBuffer) {
      blob = new Blob([file], { type: 'application/pdf' });
    } else {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      blob = await response.blob();
    }

    url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = /\.pdf$/i.test(fileName) ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('[PdfViewer] Failed to download file:', error);
  } finally {
    if (url) {
      window.URL.revokeObjectURL(url);
    }
  }
}
