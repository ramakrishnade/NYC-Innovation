import * as React from 'react';
import { sp } from "@pnp/sp/presets/all"
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ShimmeredDetailsList, DetailsListLayoutMode, SelectionMode, IColumn, Spinner, SpinnerSize} from '@fluentui/react';
import {IDDCApplicationStatusProps} from './IDDCApplicationStatusProps';
import {IDDCApplicationStatusItem} from './IDDCApplicationStatusItem';
import styles from './GridComponent.module.scss'; // Add a CSS module for styling


interface IDDCApplicationStatusState {
    items: IDDCApplicationStatusItem[]; // State to store list items
    isLoading: boolean; // State to show a loading spinner
    error: string | null; // State to track errors
    applicationName: string;
    status: string;
    siteUrl: string; 
  }

  // Define the SharePoint list name in a constant 
const LIST_NAME = "DDC Application Status";
class DDCApplicationStatus extends React.Component<IDDCApplicationStatusProps, IDDCApplicationStatusState,IDDCApplicationStatusItem> {
    private refreshInterval: number | null = null;

    //private refreshInterval: number | null = null;
    //private itemsPerPage = 5;
        constructor(props: IDDCApplicationStatusProps) {
        super(props);

        this.state = {
        items: [],
        isLoading: true,
        error: null,
        applicationName: '',
        status: '',
        siteUrl: '',


        };
        this.loadItems = this.loadItems.bind(this);
    }
    componentDidMount(): void {
        //this.fetchItems(); // Fetch data when the component mounts
        this.loadItems();
        this.refreshInterval = setInterval(this.loadItems, 20000); // 20 seconds
        //this.refreshInterval = window.setInterval(this.loadItems, 20000);
      }
    public componentWillUnmount(): void { 
        // Clear the interval to avoid memory leaks 
        if (this.refreshInterval) {
          //window.clearInterval(this.refreshInterval);
          clearInterval(this.refreshInterval);
        }
    }
    
      public async loadItems() {
        /* // Set loading state to true to show the spinner
        this.setState({
            isLoading: true,
            error: null, // Reset the error when trying to load new data
        }); */
        try { 
          const web = await sp.web();
          const siteUrl = web.Url;
          const items: IDDCApplicationStatusItem[] = await sp.web.lists.getByTitle(LIST_NAME).items 
          .select("Id", "Title", "Status","Editor/Title" , "Modified") 
          .expand("Editor")();
          console.log("Items loaded:", items); 
          this.setState({ 
            siteUrl ,
            items,
            isLoading: false,
            error: '' // Clear any previous errors
           }); 
        } 
          catch (error) { 
            this.setState({
              items: [],
              isLoading: false,
              error: `Error loading items: ${error.message}`
            });
            console.error('Error loading items:', error);
          }
      }
      render() {
        const { items , isLoading , error} = this.state;
        const columns: IColumn[] = [ 
            { key: 'column1', name: 'Application Name', fieldName: 'Title', minWidth: 100, maxWidth: 200,isMultiline: true,isResizable: true }, 
            { key: 'column2', name: 'Status', fieldName: 'Status', minWidth: 100, maxWidth: 200, isResizable: true, onRender: this.renderStatusColumn  },      
            { key: 'column4', name: 'Modified By', fieldName: 'Editor', minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => item.Editor.Title },
            { key: 'column3', name: 'Modified', fieldName: 'Modified', minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => new Date(item.Modified).toLocaleString() }
          ];
        return (
            <div className={styles.ddcApplicationStatus}>
                {isLoading ? ( 
                    <Spinner size={SpinnerSize.large} label="Loading items..." /> 
                ) : error ? (
                  <div style={{ color: 'red' }}>Error: {error}</div>
                ) :( 

                    <ShimmeredDetailsList 
                        items={items} 
                        columns={columns} 
                        setKey="set" 
                        //layoutMode={DetailsListLayoutMode.justified} 
                        selectionMode={SelectionMode.none} 
                        layoutMode={DetailsListLayoutMode.justified}
                        isHeaderVisible={true}
                        styles={{ root: { overflowX: 'auto' } }} 
                    />

                )}
            </div>
        );
      }
      private renderStatusColumn(item: IDDCApplicationStatusItem): JSX.Element { 
       
        if (item.Status.toLocaleLowerCase() === 'up' || item.Status.toLocaleLowerCase() === '[up]') 
            {
                return(
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'green',
                        padding: '5px',
                        borderRadius: '4px',
                        color: 'white',
                        
                      }}>
                        <span style={{ fontSize: '14px' }}>
                            {item.Status.replace(/[\[\]]/g, '')}
                        </span>
                    </div>
                );
            }
            else if (item.Status.toLocaleLowerCase() === 'down' || item.Status.toLocaleLowerCase() === '[down]')
            {
                return(
                <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'red',
                  padding: '5px',
                  borderRadius: '4px',
                  color: 'white'
                }}
              >
                 <span style={{ fontSize: '14px' }}>{item.Status.replace(/[\[\]]/g, '')}</span> {/* Text next to the icon */}
              </div>

                );

            }
            else {
                return(
                <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'grey',
                    padding: '5px',
                    borderRadius: '4px',
                    color: 'white'
                    }}
              >
                    <span style={{ fontSize: '14px' }}>{item.Status}</span>
                </div>
                );
            }
            //<span className={statusStyle[item.Status] || ''}> 
    }
}
export default DDCApplicationStatus;