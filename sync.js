const http = require('http');
http.get('http://localhost:3001/api/listings', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const listings = JSON.parse(data);
    let amenities = new Set();
    let propertyTypes = new Set();
    listings.forEach(l => {
      if (l.amenities) l.amenities.forEach(a => amenities.add(a.trim()));
      if (l.propertyType) propertyTypes.add(l.propertyType.trim());
    });
    
    // Default fallback values just in case
    ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Pool', 'TV', 'Washer'].forEach(a => amenities.add(a));
    ['Hotel', 'Resort', 'Villa', 'Apartment', 'Cabin', 'Hostel', 'Guest house'].forEach(a => propertyTypes.add(a));
    
    const body = JSON.stringify({
      amenities: Array.from(amenities),
      propertyTypes: Array.from(propertyTypes)
    });
    console.log("Sending:", body);
    const req = http.request('http://localhost:3001/api/admin/filter-settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => { console.log(`BODY: ${chunk}`); });
    });
    req.write(body);
    req.end();
  });
});
