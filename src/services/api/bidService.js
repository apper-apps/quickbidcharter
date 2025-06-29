import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const tableName = 'bid';

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "auction_id" } },
        { field: { Name: "user_id" } },
        { field: { Name: "bidder_name" } },
        { field: { Name: "amount" } },
        { field: { Name: "timestamp" } }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
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
    console.error('Error fetching bids:', error);
    toast.error('Failed to fetch bids');
    return [];
  }
};

export const getById = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "auction_id" } },
        { field: { Name: "user_id" } },
        { field: { Name: "bidder_name" } },
        { field: { Name: "amount" } },
        { field: { Name: "timestamp" } }
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
    console.error(`Error fetching bid with ID ${id}:`, error);
    toast.error('Failed to fetch bid');
    return null;
  }
};

export const getByAuctionId = async (auctionId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "auction_id" } },
        { field: { Name: "user_id" } },
        { field: { Name: "bidder_name" } },
        { field: { Name: "amount" } },
        { field: { Name: "timestamp" } }
      ],
      where: [
        {
          FieldName: "auction_id",
          Operator: "EqualTo",
          Values: [parseInt(auctionId)]
        }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
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
    console.error('Error fetching bids by auction ID:', error);
    toast.error('Failed to fetch bids');
    return [];
  }
};

export const getByUserId = async (userId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: [
        { field: { Name: "auction_id" } },
        { field: { Name: "user_id" } },
        { field: { Name: "bidder_name" } },
        { field: { Name: "amount" } },
        { field: { Name: "timestamp" } }
      ],
      where: [
        {
          FieldName: "user_id",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        }
      ],
      orderBy: [
        {
          fieldName: "timestamp",
          sorttype: "DESC"
        }
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
    console.error('Error fetching bids by user ID:', error);
    toast.error('Failed to fetch bids');
    return [];
  }
};

export const create = async (bidData) => {
  try {
    const apperClient = getApperClient();
    const params = {
      records: [
        {
          auction_id: parseInt(bidData.auction_id),
          user_id: parseInt(bidData.user_id),
          bidder_name: bidData.bidder_name,
          amount: parseFloat(bidData.amount),
          timestamp: new Date().toISOString()
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
        console.error(`Failed to create ${failedRecords.length} bids:${JSON.stringify(failedRecords)}`);
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
    console.error('Error creating bid:', error);
    toast.error('Failed to create bid');
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
          auction_id: parseInt(updateData.auction_id),
          user_id: parseInt(updateData.user_id),
          bidder_name: updateData.bidder_name,
          amount: parseFloat(updateData.amount),
          timestamp: updateData.timestamp
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
        console.error(`Failed to update ${failedUpdates.length} bids:${JSON.stringify(failedUpdates)}`);
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
    console.error('Error updating bid:', error);
    toast.error('Failed to update bid');
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
        console.error(`Failed to delete ${failedDeletions.length} bids:${JSON.stringify(failedDeletions)}`);
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    console.error('Error deleting bid:', error);
    toast.error('Failed to delete bid');
    return false;
  }
};

// Export delete as delete for backward compatibility
export { delete_ as delete };