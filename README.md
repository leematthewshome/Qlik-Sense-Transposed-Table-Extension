# Qlik-Sense-Transposed-Table-Extension
This visualisation extension for Qlik Sense allows for complex financial report style outputs, where each row is a unique calculation.

Often there is a requirement for highly structured, financial type reports to be created in Qlik. These reports are tricky to create in most BI software as they usually require different calculations on various rows. BI software (like Qlik) usually generates columns for each calculation and a dimension determines the split by rows. This extension takes a different approach. Columns are transposed as rows and vice versa - each new calculation you add will add a new row to the report. This allows the report layout to be defined entirely through the UI by the user. 

There are already a couple of great extensions available on Branch.Qlik.Com which can produce financial style reports. These solutions generally rely on the layout of the report being represented in the data model in some way. This extension is not meant to be a replacement for other extensions that exist. Rather it is designed to complement them, as each approach has its benefits and in combination you will hopefully have all your financial reporting needs covered. 

Major credit for this extension goes to Michael Clemens who wrote the transposition logic. I merely added the table formatting logic.

Youtube Demo: https://www.youtube.com/watch?v=f2EWvqAVr2M&t=2s

![Alt text](Extension.png?raw=true "Example config")

Report Level Configuration Settings
-----------------------------------
1.	Label Column Header: This is the text that will appear in the first field of the first column, above the row descriptions.
2.	Header Background color: The background color for the header row. Enter it as a hexadecimal value.
3.	Header text color: The text color for the header row. Enter it as a hexadecimal value.
4.	Format all values: To save you from having to format the number for every single row you can set the global format here. Row level formats will override  this value for the specific row.
5.	Hide decimals: To save you from having to format hide decimals for every single row you can set it globally here. This will cause each number to be  rounded. Row level formats will override this value for the specific row.
6.	Add totals column: Check this box to create a totals column on the end of the report. Rows with a percentage in the text (ie. ratios) will not be totaled.

Dimension Level (ie. column) Settings
--------------------------------------
The report dimension will determine the number of columns. Only one dimension can be used at this stage. There are no other special dimensional settings.

Measure Level (ie. Row) Settings
---------------------------------
1.	Indent Level: Select a value to indent the text. Each incremental number will indent the row text by another 10 pixels. This will help visually define sections in the report.
2.	Bold Text: Tick this option on to display the text as Bold for this row.
3.	Italic Text: Tick this option on to display the text as Italic for this row.
4.	Background color: Set a background color for the row. Enter it as a hexadecimal value.


Reports With Comparison Columns & Ratio Columns
-----------------------------------------------
The transposed table approach works very well when you wish to create a financial report that has columns created via a dimension, such as fiscal month or division. When you wish to have columns that each are a separate calculation, then you need to represent those calculations in the data model via a dimension. The extension comes with a simple example and a Word document that outlines how these sort of reports can be constructed.  
