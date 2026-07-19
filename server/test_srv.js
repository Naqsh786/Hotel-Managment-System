import dns from 'dns';
import fs from 'fs';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS

dns.resolveSrv('_mongodb._tcp.cluster0.84nc37n.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('DNS Lookup failed even with Google DNS:', err);
    } else {
        console.log('Successfully resolved SRV records:');
        console.log(addresses);
        
        // Construct standard connection string
        const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
        const standardUri = `mongodb://Hotel_Management:Hotel786@${hosts}/HotelManagementSystem?ssl=true&replicaSet=atlas-2f6y3z-shard-0&authSource=admin&retryWrites=true&w=majority`;
        console.log('\nSuggested Standard URI:');
        console.log(standardUri);
        
        // We will need the replicaSet name. Usually we can guess it, or we just try with standard URI
    }
});
