import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import DDCApplicationStatus from './components/DDCApplicationStatus/DDCApplicationStatus';
//import ShowDateTime from ',/components/ShowDateTime/ShowDateTime'

export default class GridViewWebPartWebPart extends BaseClientSideWebPart<{}> {

  public render(): void {
    const element: React.ReactElement<any> = React.createElement(

      DDCApplicationStatus

    );

    ReactDom.render(element, this.domElement);
  }
}
