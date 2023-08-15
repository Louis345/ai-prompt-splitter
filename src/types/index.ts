export interface Summary {
  title: string;
  chunks: string[];
  id: number;
}

export interface UpdateCollectionParams {
  collectionId: number;
  newName: string;
}
