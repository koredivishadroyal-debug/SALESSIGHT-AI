import { toPng, toSvg } from 'html-to-image';

export const exportAsImage = async (elementId: string, filename: string, format: 'png' | 'svg' = 'png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    let dataUrl = '';
    if (format === 'png') {
      dataUrl = await toPng(element, { quality: 0.95, backgroundColor: '#0a0a0a' });
    } else {
      dataUrl = await toSvg(element, { backgroundColor: '#0a0a0a' });
    }

    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Export failed', error);
  }
};
