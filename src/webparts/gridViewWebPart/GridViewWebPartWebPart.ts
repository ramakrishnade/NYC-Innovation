import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import DDCApplicationStatus from './components/DDCApplicationStatus/DDCApplicationStatus';
import { sp } from "@pnp/sp/presets/all";

//import ShowDateTime from ',/components/ShowDateTime/ShowDateTime'

export default class GridViewWebPartWebPart extends BaseClientSideWebPart<{}> {

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context as any
      });
    });
  }
  public render(): void {
    const element: React.ReactElement<any> = React.createElement(

      DDCApplicationStatus,
      {
        context: this.context
      }

    );

    ReactDom.render(element, this.domElement);
  }
}
