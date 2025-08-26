interface DrawViewItemPosition {
  x: number;
  y: number;
  z?: number; // z is a z-axis index, which defines order of items rendering
}

interface DrawViewItemDimensions {
  width: number;
  height: number;
}

interface DrawViewItemBase extends DrawViewItemPosition {
  type: string;
  id: number; // internal client side param to items idenitifying
  classes?: string;
}

interface DrawViewItemPointReference {
  pointUUID?: string; // for absolute point references
  pointXID?: string; // for relative building references
}

// interface DrawViewItemTextValue extends Partial<DrawViewItemDimensions> {
//     label?: string;
//     showLabel: boolean;
// }

// interface DrawViewItemImageValue extends DrawViewItemDimensions {
//     label?: string;
//     image: string;

//     // Image dimensions (width and height dimensions are container dimensions)
//     imageWidth?: number;
//     imageHeight?: number;
// }
