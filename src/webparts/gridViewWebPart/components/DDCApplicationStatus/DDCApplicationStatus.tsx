import * as React from 'react';
import { sp } from "@pnp/sp/presets/all"
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ShimmeredDetailsList, DetailsListLayoutMode, SelectionMode, IColumn, Spinner, SpinnerSize, Stack  } from '@fluentui/react';
//import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, Spinner, SpinnerSize, Stack, TextField, PrimaryButton } from '@fluentui/react';
import {IDDCApplicationStatusProps} from './IDDCApplicationStatusProps';
import {IDDCApplicationStatusItem} from './IDDCApplicationStatusItem';
import styles from './GridComponent.module.scss'; // Add a CSS module for styling
//import styles from './DDCApplicationStatus.module.scss'; // Assume styling is in this file

interface IDDCApplicationStatusState {
  items: IDDCApplicationStatusItem[]; // State to store list items
  isLoading: boolean; // State to show a loading spinner
  error: string | null; // State to track errors
  isEditMode: boolean;
  currentItem: IDDCApplicationStatusItem | null;
  applicationName: string;
  status: string;
  siteUrl: string;
  successMessage: string;
  currentPage: number;
  

}
// Define the SharePoint list name in a constant 
const LIST_NAME = "DDC Application Status";

class DDCApplicationStatus extends React.Component<IDDCApplicationStatusProps, IDDCApplicationStatusState,IDDCApplicationStatusItem> {
  private refreshInterval: number | null = null;
  private itemsPerPage = 5;
    constructor(props: IDDCApplicationStatusProps) {
    super(props);

    this.state = {
      items: [],
      isLoading: true,
      error: null,
      isEditMode: false,
      currentItem: null,
      applicationName: '',
      status: '',
      siteUrl: '',
      successMessage: '',
      currentPage: 0,


    };

    this.loadItems = this.loadItems.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(): void {
    //this.fetchItems(); // Fetch data when the component mounts
    this.loadItems();
    this.refreshInterval = window.setInterval(this.loadItems, 20000);
  }
  public componentWillUnmount(): void { 
    // Clear the interval to avoid memory leaks 
    if (this.refreshInterval !== null) {
      window.clearInterval(this.refreshInterval);
    }
  }
  public async loadItems() {
    try { 
      const web = await sp.web();
      const siteUrl = web.Url;
      const items: IDDCApplicationStatusItem[] = await sp.web.lists.getByTitle(LIST_NAME).items 
      .select("Id", "Title", "Status","Editor/Title" , "Modified") .expand("Editor")();
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
  public handleEdit(item: IDDCApplicationStatusItem) {
    this.setState({ 
      isEditMode: true, 
      currentItem: item, 
      applicationName: item["Title"], 
      status: item["Status"],
      successMessage: '' // Clear any previous success message
    });
  }
 public async handleUpdate() {
    const { currentItem, applicationName, status } = this.state;

    if (currentItem) {
      try {
        console.log(currentItem.Id,applicationName,status);
        await sp.web.lists.getByTitle(LIST_NAME).items.getById(currentItem.Id).update({
        "Title": applicationName,
        "Status": status
      });
      this.setState({ 
        isEditMode: false, 
        currentItem: null, 
        applicationName: '', 
        status: '',
        successMessage: 'Item successfully edited!' // Set success message
      });
      this.loadItems();
    } 
    catch (error) { console.error("Error updating item:", error); }
    }
  }
  public async handleDelete(itemId: number) {
    await sp.web.lists.getByTitle(LIST_NAME).items.getById(itemId).delete();
    this.setState({
      successMessage: 'Item successfully deleted!' // Set success message
      });
    this.loadItems();
  }
  public handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    this.setState({ [name]: value } as any);
  }
  public handleCancel() { 
    this.setState({ 
      isEditMode: false, 
      currentItem: null, 
      applicationName: '', 
      status: '', 
      successMessage: '' 
    }); 
  }
/*   fetchItems = async (): Promise<void> => {
    this.setState({ isLoading: true, error: null });

    try {
      const items = await sp.web.lists.getByTitle(this.props.listName).items();
      this.setState({ items, isLoading: false });
    } catch (error) {
      console.error("Error fetching list items:", error);
      this.setState({ error: "Failed to fetch data.", isLoading: false });
    }
  }; */
  render(): React.ReactElement<IDDCApplicationStatusProps> {
    const { items , isLoading } = this.state;
    const columns: IColumn[] = [ 
      { key: 'column1', name: 'Application Name', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true }, 
      { key: 'column2', name: 'Status', fieldName: 'Status', minWidth: 100, maxWidth: 200, isResizable: true, onRender: this.renderStatusColumn },      
      { key: 'column4', name: 'Modified By', fieldName: 'Editor', minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => item.Editor.Title },
      { key: 'column3', name: 'Modified', fieldName: 'Modified', minWidth: 100, maxWidth: 200, isResizable: true, onRender: (item) => new Date(item.Modified).toLocaleString() }
    ];
    return (
      <div className={styles.ddcApplicationStatus}>
        <Stack 
          horizontalAlign="start" 
          styles={{ 
            root: { 
              backgroundColor: '#f3f2f1', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              marginBottom: '20px' 
            } 
          }} 
        > 
          <h2>DDC Application Status</h2> 
        </Stack>
        {isLoading ? ( 
          <Spinner size={SpinnerSize.large} label="Loading items..." /> 
          ) : ( 
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
    const statusStyle: { [key: string]: string } = { 
      UP : styles.activeStatus,
      Down: styles.pendingStatus,
      Active: styles.activeStatus, 
      Inactive: styles.inactiveStatus, 
      Pending: styles.pendingStatus, 
      Closed: styles.closedStatus 
    }; 
    
    return ( 
    //<span className={statusStyle[item.Status] || ''}> 
    <span className={`${styles.statusCell} ${statusStyle[item.Status] || ''}`}>
      {item.Status} 
    </span> 
    ); 
  }
}
export default DDCApplicationStatus;