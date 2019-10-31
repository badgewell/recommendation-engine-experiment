export function cleanObjectForElasticSearch(object) {
    if (!object) { // check that its not null or undefined
        return object;
    }
  for (let key of Object.keys(object)) {
    try {

      if (typeof object[key] === 'string' && object[key].length === 0) { // remove if the key/value is empty string
        delete object[key];
        continue;
      }
    //   if (typeof object[key] === 'string' && object[key].includes('.')) { // remove the dots from the the value
    //     object[key] = object[key].replace(/\./g, '');
    //   }
      // those are for handling the key naming so its down to take the new value
      if (key === '') { // remove if the key is empty string
        delete object[key];
      }
      if (typeof key === 'string' && key.includes('.')) { // remove the dots from the key
        const newName = key.replace(/\./g, '');
        object[newName] = object[key];
        delete object[key];
        key = newName; // re assign the key again
      }
      if (typeof object[key] === 'object') { // Recursion
        object[key] = cleanObjectForElasticSearch(object[key]);
      }

    } catch (error) {
      console.error(error);
      console.error(`cleanObjectForElasticSearch: value is ${object[key]}`);
    }
  }
  return object;
}
console.log(
  JSON.stringify(
    cleanObjectForElasticSearch({
      hady: true,
      za: 0,
      '.ncz': true,
      '.zx': '.zzz.',
      '': '',
      '.sdf': 'ewrw',
      az: '.cnz.',
      array1: ['.cnx.', 'cz', '', 'cnx.'],
      array2: [
        {
          itemA: '.cnx',
          itemc: '',
          itemN: {
            zx: '.cz.'
          },
          '._itemN': {
            zx: '.cz.'
          }
        }
      ],
      '._array2': [
        {
          itemA: '.cnx',
          itemc: '',
          itemN: {
            zx: '.cz.'
          }
        }
      ],
      objt: {
        zaz: '.cnx',
        sdfzz: '',
        zxczcz: {
            '': 'sdfsdf'
        }
      },
      '._objt': {
        zaz: '.cnx',
        sdfzz: '',
        zxczcz: {
            '': 'sdfsdf'
        }
      }
    })
  )
);
