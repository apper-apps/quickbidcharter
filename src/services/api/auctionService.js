import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const tableName = 'auction';

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "terms" } },
        { field: { Name: "images" } },
        { field: { Name: "starting_bid" } },
        { field: { Name: "current_bid" } },
        { field: { Name: "highest_bidder_id" } },
        { field: { Name: "end_time" } },
        { field: { Name: "status" } }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching auctions:', error);
    toast.error('Failed to fetch auctions');
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "title" } },
        { field: { Name: "description" } },
        { field: { Name: "terms" } },
        { field: { Name: "images" } },
        { field: { Name: "starting_bid" } },
        { field: { Name: "current_bid" } },
        { field: { Name: "highest_bidder_id" } },
        { field: { Name: "end_time" } },
        { field: { Name: "status" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching auction with ID ${id}:`, error);
    toast.error('Failed to fetch auction');
    return null;
  }
};

export const create = async (auctionData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          title: auctionData.title,
          description: auctionData.description,
          terms: auctionData.terms,
          images: auctionData.images,
          starting_bid: parseFloat(auctionData.starting_bid),
          current_bid: parseFloat(auctionData.current_bid || auctionData.starting_bid),
          highest_bidder_id: auctionData.highest_bidder_id ? parseInt(auctionData.highest_bidder_id) : null,
          end_time: auctionData.end_time,
          status: auctionData.status || 'active'
        }
      ]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} auctions:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    console.error('Error creating auction:', error);
    toast.error('Failed to create auction');
    return null;
  }
};

export const update = async (id, updateData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          Id: parseInt(id),
          title: updateData.title,
          description: updateData.description,
          terms: updateData.terms,
          images: updateData.images,
          starting_bid: parseFloat(updateData.starting_bid),
          current_bid: parseFloat(updateData.current_bid),
          highest_bidder_id: updateData.highest_bidder_id ? parseInt(updateData.highest_bidder_id) : null,
          end_time: updateData.end_time,
          status: updateData.status
        }
      ]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} auctions:${JSON.stringify(failedUpdates)}`);
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    console.error('Error updating auction:', error);
    toast.error('Failed to update auction');
    return null;
  }
};

export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} auctions:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    console.error('Error deleting auction:', error);
    toast.error('Failed to delete auction');
    return false;
  }
};

// Export delete as delete for backward compatibility
export { delete_ as delete };