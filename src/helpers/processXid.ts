export const processXid = (xid: string): string => {
	// Trimming white spaces at the beginning and end
	xid = xid.trim();

	// Converting to lowercase
	xid = xid.toLowerCase();

	// Removing non-alphanumeric characters:
	xid = xid.replace(/\W+/g, '');

	return xid;
};
