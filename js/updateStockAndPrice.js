const { google } = require('googleapis');
require('dotenv').config();


async function ActualizarStockEnGoogleSheets(products) {
    const auth = new google.auth.GoogleAuth({
      keyFile: "secret.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
  
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
  
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = "stock&price!A2:E6"; // Rango que contiene todos los datos
  
    try {
      // Obtén los datos existentes de la hoja
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range,
      });
  
      const productsSheetInfo = getRows.data.values;
  
      // Actualizar los valores de stock en las filas correspondientes
      for (const product of products) {
        const productRow = productsSheetInfo.find((productInfo) => productInfo[1] === product.name);
  
        if (productRow) {
          // Actualiza el valor del stock en la fila
          productRow[3] = product.stock.toString(); // Suponiendo que el stock está en la tercera columna (índice 2)
        } else {
          console.error(`Producto ${product.name} no encontrado en la hoja.`);
        }
      }
  
      // Construye los valores actualizados para la hoja
      const values = productsSheetInfo.map((row) => row.map(String));
  
      // Actualiza todas las filas en Google Sheets
      await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: range, // Asegúrate de que sea el mismo rango que se utilizó para obtener los datos
        valueInputOption: "RAW",
        resource: {
          values,
        },
      });
  
      // Muestra mensajes de stock actualizado para cada producto
      for (let product of products) {
        console.log(`Stock actualizado para ${product.name}: ${product.stock}`);
      }
    } catch (error) {
      console.error(`Error al actualizar el stock: ${error.message}`);
    }
  }
  

async function ActualizarPrecioEnGoogleSheets(selectedProduct, newPrice) {
    const auth = new google.auth.GoogleAuth({
        keyFile: "secret.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = "stock&price!A2:E6"; // Rango que contiene todos los datos

    try {
        // Obtén los datos existentes de la hoja
        const getRows = await googleSheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range,
        });

        const productsSheetInfo = getRows.data.values;

        // Busca la fila correspondiente al producto seleccionado
        const productRow = productsSheetInfo.find((productInfo) => productInfo[1] === selectedProduct.name);

        if (productRow) {
            // Actualiza el valor del precio en la fila
            productRow[2] = newPrice.toString(); // Suponiendo que el precio está en la tercera columna (índice 2)

            // Construye los valores actualizados para la hoja
            const values = [productRow];

            // Actualiza la fila completa en Google Sheets
            await googleSheets.spreadsheets.values.update({
                spreadsheetId,
                range: range, // Asegúrate de que sea el mismo rango que se utilizó para obtener los datos
                valueInputOption: "RAW",
                resource: {
                    values,
                },
            });

            console.log(`Precio actualizado para ${selectedProduct.name}: ${newPrice}`);
        } else {
            console.error(`Producto ${selectedProduct.name} no encontrado en la hoja.`);
        }
    } catch (error) {
        console.error(`Error al actualizar el precio para ${selectedProduct.name}: ${error.message}`);
    }
}



module.exports = {
    ActualizarStockEnGoogleSheets,ActualizarPrecioEnGoogleSheets,
};