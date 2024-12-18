import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp/presets/all";
import DDCApplicationStatus from './components/DDCApplicationStatus/DDCApplicationStatus';
export interface INycInnovationWebpartWebPartProps {
  description: string;
}

export default class NycInnovationWebpartWebPart extends BaseClientSideWebPart<INycInnovationWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(
      DDCApplicationStatus,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context as any
      });
    });
  }
}
