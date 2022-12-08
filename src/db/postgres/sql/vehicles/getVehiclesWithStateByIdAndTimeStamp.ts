export default 'SELECT v.id, v.make, v.model, v.state as "currentState", sl.state as "pastState", sl.timestamp ' +
'FROM "stateLogs" sl ' +
'LEFT JOIN vehicles v ON v.id=sl."vehicleId" WHERE v.id=$1 AND sl.timestamp<=$2 ' +
'ORDER BY sl.timestamp DESC ' +
'LIMIT 1';
