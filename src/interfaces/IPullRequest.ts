export interface ICodeChange {
  id: number;
  afterChange: string;
  fileContent: string;
}

export interface ICodePlacement {
  id: number;
  lineToAddComment: number;
  commentLength: number;
}

export interface AllFileChanges {
  [filename: string]: FileChange[];
}

export  interface FileChange {
  id: number;
  comment: string;
  code: string;
}