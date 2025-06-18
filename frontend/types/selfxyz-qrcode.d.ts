declare module '@selfxyz/qrcode' {
  import { ReactNode } from 'react';
  
  export interface SelfAppConfig {
    appName: string;
    scope: string;
    endpoint: string;
    endpointType: 'https' | 'http';
    userId: string;
    userIdType: 'uuid' | 'hex';
    disclosures: {
      issuing_state?: boolean;
      name?: boolean;
      nationality?: boolean;
      [key: string]: boolean | undefined;
    };
    devMode?: boolean;
    header?: string;
  }

  export class SelfAppBuilder {
    constructor(config: SelfAppConfig);
    build(): any;
  }

  export interface SelfQRCodeWrapperProps {
    selfApp: any;
    onSuccess?: (data?: any) => void;
    onError?: (error: any) => void;
    size?: number;
  }

  const SelfQRcodeWrapper: React.FC<SelfQRCodeWrapperProps>;
  export default SelfQRcodeWrapper;
}