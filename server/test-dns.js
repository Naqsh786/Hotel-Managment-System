import dns from 'dns';

const srvRecord = '_mongodb._tcp.cluster0.84nc37n.mongodb.net';

console.log(`Attempting to resolve SRV record: ${srvRecord}`);

dns.resolveSrv(srvRecord, (err, addresses) => {
    if (err) {
        console.error('❌ DNS Resolve SRV Error:', err);
        return;
    }
    console.log('✅ SRV Record Resolved:', addresses);
});

dns.lookup('cluster0.84nc37n.mongodb.net', (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup Error:', err);
        return;
    }
    console.log('✅ DNS Lookup success:', address);
});
