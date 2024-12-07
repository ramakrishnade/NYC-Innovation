import * as React from 'react';
import { sp } from "@pnp/sp/presets/all"
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItem } from "@pnp/sp/items";
import { WebPartContext } from '@microsoft/sp-webpart-base'

;
//import styles from './DDCApplicationStatus.module.scss'; // Assume styling is in this file

interface IDDCApplicationStatusProps {
  context: WebPartContext;
}
interface IDDCApplicationStatusItem { 
  Id: number; 
  "Application Name": string; 
  Status: string; 
}

interface IDDCApplicationStatusState {
  items: any[]; // State to store list items
  isLoading: boolean; // State to show a loading spinner
  error: string | null; // State to track errors
  isEditMode: boolean;
  currentItem: IItem | null;
  applicationName: string;
  status: string;

}
class DDCApplicationStatus extends React.Component<IDDCApplicationStatusProps, IDDCApplicationStatusState,IDDCApplicationStatusItem> {
  constructor(props: IDDCApplicationStatusProps) {
    super(props);

    this.state = {
      items: [],
      isLoading: false,
      error: null,
      isEditMode: false,
      currentItem: null,
      applicationName: '',
      status: ''

    };

    this.loadItems = this.loadItems.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  componentDidMount(): void {
    //this.fetchItems(); // Fetch data when the component mounts
    this.loadItems();
  }
  public async loadItems() {
    const items: IItem[] = await sp.web.lists.getByTitle("DDC Application Status").items.get();
    this.setState({ items });
  }
  public handleEdit(item: IItem) {
    this.setState({ 
      isEditMode: true, 
      currentItem: item, 
      //applicationName: item["Application Name"], 
      //status: item["Status"] 
    });
  }
 /*  public async handleUpdate() {
    const { currentItem, applicationName, status } = this.state;

    if (currentItem) {
      await sp.web.lists.getByTitle("DDC Application Status").items.getById(currentItem.Id).update({
        "Application Name": applicationName,
        "Status": status
      });
      this.setState({ 
        isEditMode: false, 
        currentItem: null, 
        applicationName: '', 
        status: ''
      });

      this.loadItems();
    }
  } */
  public async handleDelete(itemId: number) {
    await sp.web.lists.getByTitle("DDC Application Status").items.getById(itemId).delete();

    this.loadItems();
  }
  public handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    this.setState({ [name]: value } as any);
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
    const { items, isEditMode, applicationName, status } = this.state;
    return (
      <div>
        <h2>DDC Application Status</h2>
        <table>
          <thead>
            <tr>
              <th>Application Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.Id}>
                <td>{item["Application Name"]}</td>
                <td>{item["Status"]}</td>
                <td>
                  <button onClick={() => this.handleEdit(item)}>Edit</button>
                  <button onClick={() => this.handleDelete(item.Id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isEditMode && (
          <div>
            <h3>Edit Item</h3>
            <input 
              type="text" 
              name="applicationName" 
              value={applicationName} 
              onChange={this.handleChange} 
            />
            <input 
              type="text" 
              name="status" 
              value={status} 
              onChange={this.handleChange} 
            />
            {/* <button onClick={this.handleUpdate}>Update</button> */}
          </div>
        )}
      </div>

    );

  }
}
export default DDCApplicationStatus;