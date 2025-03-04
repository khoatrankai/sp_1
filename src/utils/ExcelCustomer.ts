export const CalculateRowHeight = (
      content: string,
      columnWidths: number,
      font: number
    ) => {
      const ROW_HEIGHT_PER_LINE = font;
      const manualLines = content.split("\n");
      const lengthLines =
        manualLines.length +
        manualLines.reduce((preValue, currValue) => {
          const lengthContent = Math.ceil(currValue.length / columnWidths) - 1;
          return lengthContent + preValue;
        }, 0);
      return (ROW_HEIGHT_PER_LINE * lengthLines * 100) / 80;
    }; 

export function getColumnName(colNumber:number){
      let columnName = '';
      while (colNumber > 0) {
        const remainder = (colNumber - 1) % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        colNumber = Math.floor((colNumber - 1) / 26);
      }
      return columnName;
    }