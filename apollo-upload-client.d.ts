declare module 'apollo-upload-client/public/createUploadLink.js' {
  import { ApolloLink } from '@apollo/client';

  interface UploadLinkOptions {
    uri?: string;
    fetch?: typeof fetch;
    headers?: Record<string, string> | (() => Record<string, string>);
    credentials?: string;
    includeExtensions?: boolean;
    isExtractableFile?: (value: unknown) => boolean;
    FormData?: typeof FormData;
    formDataAppendFile?: (formData: FormData, fieldName: string, file: unknown) => void;
  }

  export default function createUploadLink(options?: UploadLinkOptions): ApolloLink;
}
