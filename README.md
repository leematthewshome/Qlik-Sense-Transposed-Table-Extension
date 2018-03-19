# Qlik-Sense-Transposed-Table-Extension
This visualisation extension for Qlik Sense allows for complex financial report style outputs, where each row is a unique calculation.

Often there is a requirement for highly structured, financial type reports to be created in Qlik. These reports are tricky to create in most BI software as they usually require different calculations on various rows. BI software (like Qlik) usually generates columns for each calculation and a dimension determines the split by rows.

There are already a couple of great extensions available on Branch.Qlik.Com which can produce financial style reports. These solutions generally rely on the layout of the report being represented in the data model in some way. This extension takes a different approach. Columns are transposed as rows and vice versa - each new calculation you add will add a new row to the report. This allows the report layout to be defined entirely through the UI by the user. 

This extension is not meant to be a replacement for other extensions that exist. Rather it is designed to complement them, as each approach has its benefits and in combination you will hopefully have all your financial reporting needs covered. 

![Alt text](Extension.png?raw=true "Example config")
