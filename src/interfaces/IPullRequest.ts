export interface IPullRequestInfo{
  [filename: string]: {
    changes: ICodeChange[];
    instructions: string;
  };
}

export interface ICodeChange {
  id: number;
  after_change: string;
  file_content: string;
}
  
export interface IModelResponse {
  [filename: string]: IResponseCodeChange[];
}

export  interface IResponseCodeChange {
  id: number;
  explanation: string;
  newCode: string;
}

export interface ICodePlacement {
  id: number;
  lineToAddComment: number;
  commentLength: number;
}