# pdf-table-json
Extractor tables from PDF as json

# Install 

```
npm install git+https://git@github.com/dileepxdn/pdf-table-json.git
```

# Example

test.js

```js
var pdf_table_json = require("./index.js");

pdf_table_json("./test.pdf").then(res => {
  console.log(JSON.stringify(res));
});


```


```
node test.js
```


### credits : 

https://github.com/ronnywang/pdf-table-extractor/


