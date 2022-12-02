import React from "react";
import { EntryTableSection, EntryBodySection } from "../EntrySections/EntrySections";

enum SectionTypes {
  SectionTable = "table",
  SectionBody = "body",
}

interface RowModel {
  title: string;
  data: string;
  mimeType: string;
  encoding: string;
  selector: string;
  type: SectionTypes;
}

interface TableModel {
  entries: () => [number, RowModel][];
}

interface SectionsRepresentationProps {
  data: TableModel;
  color: string;
}

const SectionsRepresentation: React.FC<SectionsRepresentationProps> = ({ data, color }) => {
  const sections = []

  if (data) {
    for (const [i, row] of data.entries()) {
      switch (row.type) {
      case SectionTypes.SectionTable:
        sections.push(
          <EntryTableSection key={i} title={row.title} color={color} arrayToIterate={JSON.parse(row.data)} />
        )
        break;
      case SectionTypes.SectionBody:
        sections.push(
          <EntryBodySection key={i} title={row.title} color={color} content={row.data} encoding={row.encoding} contentType={row.mimeType} selector={row.selector} />
        )
        break;
      default:
        break;
      }
    }
  }

  return <React.Fragment>{sections}</React.Fragment>;
}

export default SectionsRepresentation
