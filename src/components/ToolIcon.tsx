import React from 'react';
import {
  Merge,
  Split,
  Minimize2,
  FileText,
  Table,
  Presentation,
  Image,
  FileImage,
  FileUp,
  MonitorPlay,
  FileSpreadsheet,
  Code2,
  Edit3,
  PenLine,
  Stamp,
  RotateCw,
  LayoutGrid,
  FileX,
  Copy,
  Crop,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
  color?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-6 h-6', color }) => {
  const iconProps = { className, style: color ? { color } : undefined };

  switch (name) {
    case 'Merge':
      return <Merge {...iconProps} />;
    case 'Split':
      return <Split {...iconProps} />;
    case 'Minimize2':
      return <Minimize2 {...iconProps} />;
    case 'FileText':
      return <FileText {...iconProps} />;
    case 'Table':
      return <Table {...iconProps} />;
    case 'Presentation':
      return <Presentation {...iconProps} />;
    case 'Image':
      return <Image {...iconProps} />;
    case 'FileImage':
      return <FileImage {...iconProps} />;
    case 'FileUp':
      return <FileUp {...iconProps} />;
    case 'MonitorPlay':
      return <MonitorPlay {...iconProps} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...iconProps} />;
    case 'Code2':
      return <Code2 {...iconProps} />;
    case 'Edit3':
      return <Edit3 {...iconProps} />;
    case 'PenLine':
      return <PenLine {...iconProps} />;
    case 'Stamp':
      return <Stamp {...iconProps} />;
    case 'RotateCw':
      return <RotateCw {...iconProps} />;
    case 'LayoutGrid':
      return <LayoutGrid {...iconProps} />;
    case 'FileX':
      return <FileX {...iconProps} />;
    case 'Copy':
      return <Copy {...iconProps} />;
    case 'Crop':
      return <Crop {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};
