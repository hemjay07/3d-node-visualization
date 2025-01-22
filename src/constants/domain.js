export const DOMAINS = [
    {
      name: 'analytics',
      nodeTypes: ['Dashboard', 'Report', 'Metric', 'Chart', 'Filter', 'Dataset', 'Query', 'Visualization', 'Alert', 'Export'],
      actions: ['View', 'Create', 'Update', 'Delete', 'Share', 'Schedule', 'Configure', 'Monitor', 'Analyze']
    },
    {
      name: 'commerce',
      nodeTypes: ['Product', 'Order', 'Cart', 'Payment', 'Shipping', 'Inventory', 'Customer', 'Promotion', 'Review', 'Wishlist'],
      actions: ['Purchase', 'Add', 'Remove', 'Checkout', 'Track', 'Return', 'Save', 'Apply', 'Rate']
    },
    {
      name: 'content',
      nodeTypes: ['Article', 'Media', 'Post', 'Comment', 'Category', 'Tag', 'Author', 'Editor', 'Version', 'Archive'],
      actions: ['Publish', 'Draft', 'Edit', 'Review', 'Approve', 'Archive', 'Restore', 'Format', 'Upload']
    },
    {
      name: 'user',
      nodeTypes: ['Profile', 'Account', 'Permission', 'Role', 'Group', 'Setting', 'Preference', 'Activity', 'Session', 'Authentication'],
      actions: ['Login', 'Register', 'Update', 'Verify', 'Reset', 'Grant', 'Revoke', 'Manage', 'Track']
    },
    {
      name: 'system',
      nodeTypes: ['Service', 'Config', 'Log', 'Cache', 'Queue', 'Job', 'Worker', 'Resource', 'Backup', 'Monitor'],
      actions: ['Start', 'Stop', 'Restart', 'Deploy', 'Scale', 'Optimize', 'Clean', 'Maintain', 'Recover']
    }
  ];