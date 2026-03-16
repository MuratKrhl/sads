import { Project, PageConfig, ImportantLink, ServerInventory, ChartDataItem, ApplicationInventory, KdbCertificate, JavaCertificate, OpenshiftInventory, DatasourceInventory, Jboss8Inventory, OnCallPerson, AskGTArticle, AskGTCategory } from '@/utils/types';

export const TASKS_CHART_DATA: ChartDataItem[] = [
  { name: 'Pending', value: 23, color: '#FBBF24' }, // amber-400
  { name: 'Behind', value: 3, color: '#EF4444' },   // red-500
  { name: 'Completed', value: 34, color: '#22C55E' },// green-500
];

export const PROJECTS_CHART_DATA: ChartDataItem[] = [
  { name: 'Pending', value: 14, color: '#14B8A6' }, // teal-500
  { name: 'Behind', value: 24, color: '#3B82F6' }, // blue-500
  { name: 'Completed', value: 2, color: '#A855F7' },// purple-500
];

export const SERVER_INVENTORY_DATA: ServerInventory[] = [
  {
    id: 'dev-app-01',
    hostname: 'dev-app-01',
    ipAddress: '10.12.0.21',
    environment: 'Dev',
    description: 'Online Scoring App Server',
    os: 'RHEL 8.5',
    kernelPatchLevel: '5.14.0-284.11.el8_8.x86_64',
    cpu: '8 Cores',
    memory: '32GB',
    disk: '500GB',
    javaVersion: 'OpenJDK 11.0.18',
    jbossVersion: '7.4.0',
    apacheVersion: '2.4.41',
    hazelcastVersion: '5.2',
    owner: 'R&D Team',
    lastUpdate: '2024-07-28'
  },
  {
    id: 'prod-app-01',
    hostname: 'prod-app-01',
    ipAddress: '10.12.3.45',
    environment: 'Prod',
    description: 'Core Banking Application Server',
    os: 'AIX 7.2',
    kernelPatchLevel: '7200-05-02-2024',
    cpu: '16 Cores',
    memory: '128GB',
    disk: '2TB',
    javaVersion: 'IBM Java 8.0.7.15',
    webSphereVersion: '9.0.5.12',
    ctgVersion: '2.3',
    owner: 'AppOps',
    lastUpdate: '2024-07-29'
  },
  {
    id: 'prod-db-01',
    hostname: 'prod-db-01',
    ipAddress: '10.12.4.10',
    environment: 'Prod',
    description: 'Database Server',
    os: 'RHEL 8.7',
    kernelPatchLevel: '5.14.0-284.11.el8_8.x86_64',
    cpu: '32 Cores',
    memory: '256GB',
    disk: '10TB',
    javaVersion: 'Oracle JDK 11.0.17',
    owner: 'DBA Team',
    lastUpdate: '2024-07-25'
  },
  {
    id: 'prod-web-01',
    hostname: 'prod-web-01',
    ipAddress: '10.12.5.20',
    environment: 'Prod',
    description: 'Web Application Server',
    os: 'RHEL 8.6',
    kernelPatchLevel: '5.14.0-284.11.el8_8.x86_64',
    cpu: '8 Cores',
    memory: '64GB',
    disk: '1TB',
    javaVersion: 'OpenJDK 11.0.16',
    jbossVersion: '7.4.0',
    apacheVersion: '2.4.41',
    owner: 'Web Platform Team',
    lastUpdate: '2024-07-27'
  },
  {
    id: 'test-web-01',
    hostname: 'test-web-01',
    ipAddress: '10.14.1.10',
    environment: 'Test',
    description: 'Test Environment Web Server',
    os: 'RHEL 7.9',
    kernelPatchLevel: '3.10.0-1160.105.1.el7.x86_64',
    cpu: '4 Cores',
    memory: '16GB',
    disk: '250GB',
    javaVersion: 'OpenJDK 8u332',
    jbossVersion: '7.3.0',
    apacheVersion: '2.4.39',
    owner: 'QA',
    lastUpdate: '2024-07-20'
  },
  {
    id: 'qa-srv-01',
    hostname: 'qa-srv-01',
    ipAddress: '10.14.2.15',
    environment: 'QA',
    description: 'QA Testing Server',
    os: 'RHEL 8.8',
    kernelPatchLevel: '5.14.0-284.11.el8_8.x86_64',
    cpu: '8 Cores',
    memory: '32GB',
    disk: '500GB',
    javaVersion: 'OpenJDK 17',
    owner: 'QA Team',
    lastUpdate: '2024-07-22'
  },
  {
    id: 'lab-srv-01',
    hostname: 'lab-srv-01',
    ipAddress: '10.14.3.25',
    environment: 'Lab',
    description: 'Laboratory Testing Server',
    os: 'Ubuntu 22.04',
    kernelPatchLevel: '5.15.0-91-generic',
    cpu: '4 Cores',
    memory: '16GB',
    disk: '250GB',
    javaVersion: 'OpenJDK 17',
    owner: 'Platform Team',
    lastUpdate: '2024-07-15'
  },
  {
    id: 'jboss8-srv-01',
    hostname: 'jboss8-srv-01',
    ipAddress: '10.12.6.30',
    environment: 'Prod',
    description: 'JBoss EAP 8 Migration Server',
    os: 'RHEL 9.1',
    kernelPatchLevel: '5.14.0-284.11.el9_1.x86_64',
    cpu: '16 Cores',
    memory: '128GB',
    disk: '2TB',
    javaVersion: 'OpenJDK 17',
    jbossVersion: '8.0.1',
    owner: 'Migration Team',
    lastUpdate: '2024-08-01'
  },
  {
    id: 'legacy-app-01',
    hostname: 'legacy-app-01',
    ipAddress: '10.12.7.40',
    environment: 'Prod',
    description: 'Legacy Application Server',
    os: 'AIX 6.1',
    kernelPatchLevel: '6100-09-02-2024',
    cpu: '4 Cores',
    memory: '32GB',
    disk: '500GB',
    javaVersion: 'IBM Java 7.1',
    webSphereVersion: '8.5.5',
    owner: 'Legacy Support',
    lastUpdate: '2024-06-10'
  }
];

export const APPLICATION_INVENTORY_DATA: ApplicationInventory[] = [
  { id: 1, applicationName: 'CoreBankingAPI', hostname: 'prod-app-01', version: '2.5.1', status: 'Running', ownerTeam: 'Core Banking Team', deploymentDate: '2024-07-28T14:00:00Z', jvmDetails: { path: '/usr/lib/jvm/java-8-ibm', memory: '4096m', heapSize: '2048m' }, datasourceInfo: { jndi: 'java:jboss/datasources/CoreDS', url: 'jdbc:db2://prod-db-01:50000/COREDB', user: 'core_user' } },
  { id: 2, applicationName: 'WebAppGateway', hostname: 'prod-web-01', version: '1.21.0', status: 'Running', ownerTeam: 'Web Platform Team', deploymentDate: '2024-07-25T10:30:00Z', middlewareInfo: 'Nginx 1.21.0' },
  { id: 3, applicationName: 'LegacySystemBridge', hostname: 'legacy-app-01', version: '1.2.0', status: 'Running', ownerTeam: 'Legacy Support', deploymentDate: '2023-01-15T11:00:00Z', jvmDetails: { path: '/opt/IBM/WebSphere/AppServer/java', memory: '2048m', heapSize: '1024m' } },
  { id: 4, applicationName: 'BatchProcessor', hostname: 'prod-app-01', version: '1.8.3', status: 'Stopped', ownerTeam: 'Core Banking Team', deploymentDate: '2024-06-10T18:00:00Z' },
  { id: 5, applicationName: 'DevTestApp', hostname: 'dev-app-01', version: '3.0.0-SNAPSHOT', status: 'Error', ownerTeam: 'R&D Team', deploymentDate: '2024-07-29T11:45:00Z' },
  { id: 6, applicationName: 'CacheService', hostname: 'prod-app-01', version: '4.2', status: 'Running', ownerTeam: 'Platform Team', deploymentDate: '2024-07-20T09:00:00Z', middlewareInfo: 'Hazelcast 4.2' },
];

const getFutureDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getPastDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const KDB_CERTIFICATE_DATA: KdbCertificate[] = [
  {
    id: 1, environment: 'Prod', server: 'app-prod-01',
    kdbPath: '/opt/IBM/was/profiles/AppSrv01/etc/key.kdb',
    alias: 'prod.core.api.cer', issuer: 'DigiCert', subject: 'CN=api.bmwportal.com',
    validTo: getFutureDate(25), trustStatus: 'Expiring', serialNumber: 'A1:B2:C3:D4:E5:F6',
    version: 'v3', validFrom: getPastDate(340), keyAlgorithm: 'RSA', keySize: '2048',
    signatureAlgorithm: 'SHA256withRSA', sha1: 'AA:BB:CC:DD:EE:FF:11:22', sha256: 'FF:EE:DD:CC:BB:AA:00:11',
    importDate: getPastDate(340), cmsStashInfo: 'Stash file present'
  },
  {
    id: 2, environment: 'Prod', server: 'web-prod-01',
    kdbPath: '/etc/nginx/ssl/key.kdb',
    alias: 'prod.webapp.cer', issuer: 'Let\'s Encrypt', subject: 'CN=portal.bmwportal.com',
    validTo: getFutureDate(55), trustStatus: 'Trusted', serialNumber: 'B2:C3:D4:E5:F6:A1',
    version: 'v3', validFrom: getPastDate(310), keyAlgorithm: 'ECDSA', keySize: '256',
    signatureAlgorithm: 'SHA256withECDSA', sha1: '11:22:33:44:55:66:77:88', sha256: '88:77:66:55:44:33:22:11'
  },
  {
    id: 3, environment: 'Test', server: 'legacy-app-01',
    kdbPath: '/opt/was/profiles/node01/key.kdb',
    alias: 'legacy.internal.cer', issuer: 'BMW Internal CA', subject: 'CN=legacy.internal',
    validTo: getFutureDate(85), trustStatus: 'Trusted', serialNumber: 'C3:D4:E5:F6:A1:B2',
    version: 'v3', validFrom: getPastDate(280), keyAlgorithm: 'RSA', keySize: '2048',
    signatureAlgorithm: 'SHA1withRSA', sha1: 'DE:AD:BE:EF:C0:FF:EE:00', sha256: '00:EE:FF:C0:EF:BE:AD:DE'
  },
  {
    id: 4, environment: 'Prod', server: 'api-prod-01',
    kdbPath: '/opt/IBM/was/etc/api.kdb',
    alias: 'wildcard.api.cer', issuer: 'Sectigo', subject: 'CN=*.api.bmwportal.com',
    validTo: getFutureDate(120), trustStatus: 'Trusted', serialNumber: 'D4:E5:F6:A1:B2:C3',
    version: 'v3', validFrom: getPastDate(245), keyAlgorithm: 'RSA', keySize: '4096',
    signatureAlgorithm: 'SHA384withRSA', sha1: 'FE:DC:BA:98:76:54:32:10', sha256: '01:23:45:67:89:AB:CD:EF'
  },
  {
    id: 5, environment: 'Dev', server: 'dev-server-01',
    kdbPath: '/home/dev/keys/dev.kdb',
    alias: 'dev.test.cer', issuer: 'Self-signed', subject: 'CN=dev.bmwportal.com',
    validTo: getFutureDate(-10), trustStatus: 'Expired', serialNumber: 'E5:F6:A1:B2:C3:D4',
    version: 'v3', validFrom: getPastDate(375), keyAlgorithm: 'RSA', keySize: '2048',
    signatureAlgorithm: 'SHA256withRSA', sha1: 'CA:FE:BABE:01:02:03:04:05', sha256: '05:04:03:02:01:BABE:FE:CA'
  },
];


export const JAVA_CERTIFICATE_DATA: JavaCertificate[] = [
  {
    id: 1, environment: 'Prod', server: 'prod-app-01', javaHome: '/usr/lib/jvm/java-11',
    aliasName: 'GlobalSign Root CA', issuer: 'GlobalSign', subject: 'CN=api.bmw.com', validTo: getFutureDate(350),
    serialNumber: '0A:0B:1C:2D:3E:4F:5A', version: 'v3', validFrom: getPastDate(15), trustStatus: 'Trusted',
    keyAlgorithm: 'RSA', keySize: '2048', signatureAlgorithm: 'SHA256withRSA',
    sha1: 'D1:E2:F3:A4:B5:C6:D7:E8:F9:0A:1B:2C:3D:4E:5F:6A:7B:8C:9D:0E',
    sha256: 'A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2'
  },
  {
    id: 2, environment: 'Prod', server: 'prod-app-02', javaHome: '/usr/lib/jvm/java-11',
    aliasName: 'bmw-internal-ca', issuer: 'BMW Internal CA', subject: 'CN=internal.bmw.com', validTo: getFutureDate(25),
    serialNumber: '1A:2B:3C:4D:5E:6F:7A', version: 'v3', validFrom: getPastDate(340), trustStatus: 'Expiring',
    keyAlgorithm: 'RSA', keySize: '2048', signatureAlgorithm: 'SHA256withRSA',
    sha1: 'E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0',
    sha256: 'B1:C2:D3:E4:F5:A6:B7:C8:D9:E0:F1:A2:B3:C4:D5:E6:F7:A8:B9:C0:D1:E2:F3:A4:B5:C6:D7:E8:F9:A0:B1:C2'
  },
  {
    id: 3, environment: 'Test', server: 'test-web-01', javaHome: '/opt/java/openjdk-8',
    aliasName: 'test-self-signed', issuer: 'CN=test-web-01', subject: 'CN=test-web-01', validTo: getFutureDate(-15),
    serialNumber: '2A:3B:4C:5D:6E:7F:8A', version: 'v3', validFrom: getPastDate(380), trustStatus: 'Expired',
    keyAlgorithm: 'RSA', keySize: '2048', signatureAlgorithm: 'SHA1withRSA',
    sha1: 'F1:A2:B3:C4:D5:E6:F7:A8:B9:C0:D1:E2:F3:A4:B5:C6:D7:E8:F9:A0',
    sha256: 'C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2'
  },
  {
    id: 4, environment: 'Dev', server: 'dev-app-01', javaHome: '/opt/java/openjdk-11',
    aliasName: 'dev_server_cert', issuer: 'BMW Dev CA', subject: 'CN=dev-app-01.bmw.dev', validTo: getFutureDate(80),
    serialNumber: '3A:4B:5C:6D:7E:8F:9A', version: 'v3', validFrom: getPastDate(285), trustStatus: 'Trusted',
    keyAlgorithm: 'ECDSA', keySize: '256', signatureAlgorithm: 'SHA256withECDSA',
    sha1: 'A0:B9:C8:D7:E6:F5:A4:B3:C2:D1:E0:F9:A8:B7:C6:D5:E4:F3:A2:B1',
    sha256: 'D1:E2:F3:A4:B5:C6:D7:E8:F9:0A:1B:2C:3D:4E:5F:6A:7B:8C:9D:0E:1F:2A:3B:4C:5D:6E:7F:8A:9B:0C:1D:2E'
  },
  {
    id: 5, environment: 'Prod', server: 'prod-db-01', javaHome: '/opt/oracle/java-11',
    aliasName: 'oracle_db_ca', issuer: 'DigiCert', subject: 'CN=db.prod.bmw.com', validTo: getFutureDate(150),
    serialNumber: '4A:5B:6C:7D:8E:9F:0A', version: 'v3', validFrom: getPastDate(215), trustStatus: 'Trusted',
    keyAlgorithm: 'RSA', keySize: '4096', signatureAlgorithm: 'SHA256withRSA',
    sha1: 'B0:C9:D8:E7:F6:A5:B4:C3:D2:E1:F0:A9:B8:C7:D6:E5:F4:A3:B2:A1',
    sha256: 'E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2'
  },
];

export const OPENSHIFT_INVENTORY_DATA: OpenshiftInventory[] = [
  {
    id: 1,
    environment: "Prod",
    clusterName: "ocp-prod-01",
    clusterVersion: "4.13",
    namespace: "payments",
    nodes: "5 Ready / 0 NotReady",
    cpuCapacity: "80 cores",
    memoryCapacity: "512GB",
    storage: "10TB",
    applications: 12,
    pods: "120 Running / 5 Pending / 0 Error",
    services: 8,
    routes: 5,
    tlsCerts: 5,
    owner: "Team A",
    lastSync: "2025-09-29",
    eventsSummary: "No critical alerts",
  },
  {
    id: 2,
    environment: "Test",
    clusterName: "ocp-test-01",
    clusterVersion: "4.13",
    namespace: "orders",
    nodes: "3 Ready / 0 NotReady",
    cpuCapacity: "32 cores",
    memoryCapacity: "128GB",
    storage: "2TB",
    applications: 5,
    pods: "20 Running / 2 Pending / 1 Error",
    services: 3,
    routes: 2,
    tlsCerts: 2,
    owner: "Team B",
    lastSync: "2025-09-28",
    eventsSummary: "Pod restart warning",
  },
  {
    id: 3,
    environment: "Dev",
    clusterName: "ocp-dev-01",
    clusterVersion: "4.12",
    namespace: "user-management",
    nodes: "2 Ready / 0 NotReady",
    cpuCapacity: "16 cores",
    memoryCapacity: "64GB",
    storage: "1TB",
    applications: 3,
    pods: "10 Running / 0 Pending / 0 Error",
    services: 2,
    routes: 1,
    tlsCerts: 1,
    owner: "Team C",
    lastSync: "2025-09-30",
    eventsSummary: "No critical alerts",
  },
];

export const DATASOURCE_INVENTORY_DATA: DatasourceInventory[] = [
  {
    id: 1,
    environment: 'Prod',
    server: 'prod-app-01',
    applicationName: 'CoreBankingAPI',
    datasourceName: 'java:jboss/datasources/CoreDS',
    dbType: 'DB2',
    connectionURL: 'jdbc:db2://prod-db-01:50000/COREDB',
    user: 'core_user',
    status: 'Active',
    activeConnections: 15,
    maxConnections: 100,
    avgResponseTime: 25,
    ownerTeam: 'Core Banking Team',
    connectionPoolSettings: { min: 10, max: 100, timeout: 300 },
    lastUpdate: '2024-07-29'
  },
  {
    id: 2,
    environment: 'Prod',
    server: 'prod-web-01',
    applicationName: 'WebAppGateway',
    datasourceName: 'java:jboss/datasources/AnalyticsDS',
    dbType: 'Oracle',
    connectionURL: 'jdbc:oracle:thin:@prod-oracle-01:1521:ORCL',
    user: 'analytics_user',
    status: 'Active',
    activeConnections: 5,
    maxConnections: 20,
    avgResponseTime: 45,
    ownerTeam: 'Web Platform Team',
    connectionPoolSettings: { min: 5, max: 20, timeout: 180 },
    lastUpdate: '2024-07-28'
  },
  {
    id: 3,
    environment: 'Test',
    server: 'test-web-01',
    applicationName: 'QATestApp',
    datasourceName: 'java:jboss/datasources/TestDS',
    dbType: 'MSSQL',
    connectionURL: 'jdbc:sqlserver://test-sql-01:1433;databaseName=QADB',
    user: 'qa_user',
    status: 'Inactive',
    activeConnections: 0,
    maxConnections: 10,
    avgResponseTime: 0,
    ownerTeam: 'QA Team',
    connectionPoolSettings: { min: 2, max: 10, timeout: 600 },
    lastUpdate: '2024-07-20'
  },
  {
    id: 4,
    environment: 'Dev',
    server: 'dev-app-01',
    applicationName: 'DevTestApp',
    datasourceName: 'java:jboss/datasources/DevDS',
    dbType: 'PostgreSQL',
    connectionURL: 'jdbc:postgresql://dev-pg-01:5432/devdb',
    user: 'dev_user',
    status: 'Error',
    activeConnections: 1,
    maxConnections: 5,
    avgResponseTime: 1500,
    ownerTeam: 'R&D Team',
    lastTestResult: 'Failed',
    connectionPoolSettings: { min: 1, max: 5, timeout: 30 },
    lastUpdate: '2024-07-30'
  },
];

export const JBOSS8_INVENTORY_DATA: Jboss8Inventory[] = [
  {
    id: 1,
    environment: 'Prod',
    server: 'prod-app-01',
    instanceName: 'jboss8-prod-01',
    version: '8.0.1.GA',
    status: 'Running',
    port: 8080,
    jvmVersion: 'OpenJDK 17',
    managementPort: 9990,
    heapSize: '4096m',
    ownerTeam: 'Middleware Team',
    lastUpdate: '2024-08-01'
  },
  {
    id: 2,
    environment: 'Prod',
    server: 'prod-app-02',
    instanceName: 'jboss8-prod-02',
    version: '8.0.1.GA',
    status: 'Running',
    port: 8080,
    jvmVersion: 'OpenJDK 17',
    managementPort: 9990,
    heapSize: '4096m',
    ownerTeam: 'Middleware Team',
    lastUpdate: '2024-08-01'
  },
  {
    id: 3,
    environment: 'Test',
    server: 'test-app-01',
    instanceName: 'jboss8-test-01',
    version: '8.0.0.Beta',
    status: 'Stopped',
    port: 8180,
    jvmVersion: 'OpenJDK 17',
    managementPort: 10090,
    heapSize: '2048m',
    ownerTeam: 'QA Team',
    lastUpdate: '2024-07-25'
  },
  {
    id: 4,
    environment: 'Dev',
    server: 'dev-app-01',
    instanceName: 'jboss8-dev-01',
    version: '8.0.0.Alpha',
    status: 'Error',
    port: 8080,
    jvmVersion: 'OpenJDK 11',
    managementPort: 9990,
    heapSize: '1024m',
    ownerTeam: 'R&D Team',
    lastUpdate: '2024-07-20'
  }
];

// FIX: Add missing ON_CALL_ROSTER_DATA constant.
export const ON_CALL_ROSTER_DATA: OnCallPerson[] = [
  { date: '2024-08-05', name: 'Zeynep Arslan', phone: '555-010-1010', email: 'zeynep.arslan@example.com', title: 'Middleware Support', avatarUrl: 'https://picsum.photos/seed/zeynep/80/80' },
  { date: '2024-08-06', name: 'Mustafa Öztürk', phone: '555-011-1111', email: 'mustafa.ozturk@example.com', title: 'System Admin', avatarUrl: 'https://picsum.photos/seed/mustafa/80/80' },
  { date: '2024-08-07', name: 'Elif Aydın', phone: '555-012-1212', email: 'elif.aydin@example.com', title: 'Database Admin', avatarUrl: 'https://picsum.photos/seed/elif/80/80' },
  { date: '2024-08-08', name: 'Emre Şahin', phone: '555-013-1313', email: 'emre.sahin@example.com', title: 'Network Engineer', avatarUrl: 'https://picsum.photos/seed/emre/80/80' },
  { date: '2024-08-09', name: 'Fatma Çelik', phone: '555-014-1414', email: 'fatma.celik@example.com', title: 'Security Specialist', avatarUrl: 'https://picsum.photos/seed/fatma/80/80' },
  { date: '2024-08-12', name: 'Ali Yıldız', phone: '555-015-1515', email: 'ali.yildiz@example.com', title: 'Ops Support', avatarUrl: 'https://picsum.photos/seed/ali/80/80' },
  { date: '2024-08-13', name: 'Hülya Kılıç', phone: '555-016-1616', email: 'hulya.kilic@example.com', title: 'Middleware & Ops', avatarUrl: 'https://picsum.photos/seed/hulya/80/80' },
  { date: '2024-08-14', name: 'İbrahim Koç', phone: '555-017-1717', email: 'ibrahim.koc@example.com', title: 'Infrastructure Lead', avatarUrl: 'https://picsum.photos/seed/ibrahim/80/80' },
  { date: '2024-08-15', name: 'Sultan Can', phone: '555-018-1818', email: 'sultan.can@example.com', title: 'Platform Engineer', avatarUrl: 'https://picsum.photos/seed/sultan/80/80' },
  { date: '2024-08-16', name: 'Osman Polat', phone: '555-019-1919', email: 'osman.polat@example.com', title: 'Senior Middleware', avatarUrl: 'https://ui-avatars.com/api/?name=Osman+Polat&background=3B82F6&color=fff&size=160&bold=true' },
];

export const ACTIVE_PROJECTS_DATA: Project[] = [
  {
    name: 'Website Redesign', date: 'Jan 30, 2025', progress: 65, status: 'On Track', assigned: [
      { name: 'User 1', avatarUrl: 'https://picsum.photos/seed/avatar1/32/32' },
      { name: 'User 2', avatarUrl: 'https://picsum.photos/seed/avatar2/32/32' },
      { name: 'User 3', avatarUrl: 'https://picsum.photos/seed/avatar3/32/32' },
    ], extraAssignees: 5
  },
  {
    name: 'Marketing Campaign', date: 'Feb 10, 2025', progress: 20, status: 'Delayed', assigned: [
      { name: 'User 4', avatarUrl: 'https://picsum.photos/seed/avatar4/32/32' },
      { name: 'User 5', avatarUrl: 'https://picsum.photos/seed/avatar5/32/32' },
    ], extraAssignees: 2
  },
  {
    name: 'Mobile App Development', date: 'Mar 1, 2025', progress: 45, status: 'At Risk', assigned: [
      { name: 'User 6', avatarUrl: 'https://picsum.photos/seed/avatar6/32/32' },
      { name: 'User 7', avatarUrl: 'https://picsum.photos/seed/avatar7/32/32' },
      { name: 'User 8', avatarUrl: 'https://picsum.photos/seed/avatar8/32/32' },
    ], extraAssignees: 1
  },
  {
    name: 'Customer Portal Upgrade', date: 'Feb 15, 2025', progress: 89, status: 'On Track', assigned: [
      { name: 'User 9', avatarUrl: 'https://picsum.photos/seed/avatar9/32/32' },
      { name: 'User 10', avatarUrl: 'https://picsum.photos/seed/avatar10/32/32' },
    ], extraAssignees: 1
  },
  {
    name: 'Product Launch', date: 'Jan 25, 2025', progress: 100, status: 'Completed', assigned: [
      { name: 'User 11', avatarUrl: 'https://picsum.photos/seed/avatar11/32/32' },
      { name: 'User 12', avatarUrl: 'https://picsum.photos/seed/avatar12/32/32' },
    ], extraAssignees: 1
  },
];

export const PAGE_CONFIG: PageConfig = {
  'Self Service': {
    tabs: [
      { label: 'Evam Listener Tanımlama' },
      {
        label: 'Datasource',
        nestedTabs: [
          { label: 'Datasource Tanımlama' },
          { label: 'Datasource Info - Datasource Connection Test' },
          { label: 'Datasource Performance' }
        ]
      },
      { label: 'Erişim Testi' },
      {
        label: 'Dump Analyzer',
        nestedTabs: [
          { label: 'Thread Dump' },
          { label: 'Heap Dump' }
        ]
      },
      { label: 'App Log' },
      { label: 'Smart Kayıt' },
    ]
  },
  'Ansible': {
    tabs: [{ label: 'Templates' }]
  },
  'AskGT': {
    tabs: [
      { label: 'JBoss' },
      { label: 'WebSphere' },
      { label: 'Nginx' },
      { label: 'Hazelcast' },
      { label: 'Provenir' },
      { label: 'Powercurve' },
      { label: 'Metaco' },
      { label: 'Evam' },
      { label: 'Aware' },
      { label: 'Openshift' }
    ]
  }
};

export const IMPORTANT_LINKS_DATA: ImportantLink[] = [
  {
    category: 'Connect',
    url: 'https://www.google.com.tr',
    description: 'Connect sistemine erişim.'
  },
  {
    category: 'Dynatrace',
    url: 'https://www.google.com.tr',
    description: 'Performans izleme aracına erişim.'
  },
  {
    category: 'Jira',
    url: 'https://www.google.com.tr',
    description: 'Proje ve görev yönetimi.'
  },

  {
    category: 'RedHat',
    url: 'https://redhatofficial.github.io',
    description: 'Proje ve görev yönetimi.'
  },
  {
    category: 'Confluence',
    url: 'https://www.google.com.tr',
    description: 'Bilgi ve dokümantasyon merkezi.'
  }
];

// AskGT Kategorileri
export const ASKGT_CATEGORIES: AskGTCategory[] = [
  { id: 'jboss', name: 'JBoss', icon: '☕', color: '#FF6B35' },
  { id: 'websphere', name: 'WebSphere', icon: '🌐', color: '#3B82F6' },
  { id: 'nginx', name: 'Nginx', icon: '⚡', color: '#10B981' },
  { id: 'hazelcast', name: 'Hazelcast', icon: '💾', color: '#8B5CF6' },
  { id: 'provenir', name: 'Provenir', icon: '📊', color: '#F59E0B' },
  { id: 'powercurve', name: 'Powercurve', icon: '📈', color: '#EF4444' },
  { id: 'metaco', name: 'Metaco', icon: '🔒', color: '#6B7280' },
  { id: 'evam', name: 'Evam', icon: '🎯', color: '#EC4899' },
  { id: 'aware', name: 'Aware', icon: '👁️', color: '#14B8A6' },
  { id: 'openshift', name: 'OpenShift', icon: '🚀', color: '#EE0000' },
];

// AskGT Makaleleri
export const ASKGT_ARTICLES: AskGTArticle[] = [
  {
    id: '1',
    title: 'JBoss EAP 7.4 Performans Optimizasyonu',
    description: 'JBoss EAP 7.4 üzerinde uygulama performansını artırma teknikleri ve en iyi uygulamalar.',
    content: 'Bu makalede JBoss EAP 7.4 üzerinde uygulama performansını artırmak için kullanabileceğiniz teknikleri detaylı olarak inceleyeceğiz...',
    author: {
      name: 'Ahmet Yılmaz',
      avatarUrl: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=3B82F6&color=fff&size=80',
      department: 'Middleware Team'
    },
    category: 'jboss',
    tags: ['performance', 'optimization', 'jboss-eap'],
    publishDate: '2024-01-15',
    readTime: 8,
    likes: 24,
    views: 156,
    thumbnailUrl: 'https://picsum.photos/seed/jboss-performance/400/200',
    isFavorite: false
  },
  {
    id: '2',
    title: 'WebSphere Liberty Profile Güvenlik Yapılandırması',
    description: 'WebSphere Liberty Profile üzerinde güvenlik ayarları ve SSL konfigürasyonu.',
    content: 'WebSphere Liberty Profile üzerinde güvenlik yapılandırması nasıl yapılır...',
    author: {
      name: 'Fatma Demir',
      avatarUrl: 'https://ui-avatars.com/api/?name=Fatma+Demir&background=EC4899&color=fff&size=80',
      department: 'Security Team'
    },
    category: 'websphere',
    tags: ['security', 'ssl', 'liberty'],
    publishDate: '2024-01-12',
    readTime: 12,
    likes: 18,
    views: 203,
    thumbnailUrl: 'https://picsum.photos/seed/websphere-security/400/200',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Nginx Load Balancer Konfigürasyonu',
    description: 'Nginx ile yük dengeleme yapılandırması ve failover stratejileri.',
    content: 'Nginx load balancer konfigürasyonu ve yüksek erişilebilirlik için failover stratejileri...',
    author: {
      name: 'Mehmet Kaya',
      avatarUrl: 'https://ui-avatars.com/api/?name=Mehmet+Kaya&background=10B981&color=fff&size=80',
      department: 'Infrastructure Team'
    },
    category: 'nginx',
    tags: ['load-balancer', 'nginx', 'high-availability'],
    publishDate: '2024-01-10',
    readTime: 15,
    likes: 31,
    views: 278,
    thumbnailUrl: 'https://picsum.photos/seed/nginx-lb/400/200',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Hazelcast Distributed Cache Yapılandırması',
    description: 'Hazelcast ile dağıtık cache sistemi kurulumu ve optimizasyonu.',
    content: 'Hazelcast distributed cache yapılandırması ve performans optimizasyonu...',
    author: {
      name: 'Ayşe Özkan',
      avatarUrl: 'https://ui-avatars.com/api/?name=Ayşe+Özkan&background=8B5CF6&color=fff&size=80',
      department: 'Backend Team'
    },
    category: 'hazelcast',
    tags: ['cache', 'distributed', 'performance'],
    publishDate: '2024-01-08',
    readTime: 10,
    likes: 22,
    views: 189,
    thumbnailUrl: 'https://picsum.photos/seed/hazelcast-cache/400/200',
    isFavorite: false
  },
  {
    id: '5',
    title: 'Provenir Decision Engine Entegrasyonu',
    description: 'Provenir decision engine ile uygulama entegrasyonu ve konfigürasyonu.',
    content: 'Provenir decision engine entegrasyonu ve API kullanımı...',
    author: {
      name: 'Can Arslan',
      avatarUrl: 'https://ui-avatars.com/api/?name=Can+Arslan&background=F59E0B&color=fff&size=80',
      department: 'Integration Team'
    },
    category: 'provenir',
    tags: ['integration', 'decision-engine', 'api'],
    publishDate: '2024-01-05',
    readTime: 14,
    likes: 16,
    views: 134,
    thumbnailUrl: 'https://picsum.photos/seed/provenir-integration/400/200',
    isFavorite: true
  },
  {
    id: '6',
    title: 'OpenShift Container Orchestration',
    description: 'OpenShift üzerinde container orkestrasyonu ve CI/CD pipeline kurulumu.',
    content: 'OpenShift container orchestration ve CI/CD pipeline yapılandırması...',
    author: {
      name: 'Zeynep Çelik',
      avatarUrl: 'https://ui-avatars.com/api/?name=Zeynep+Çelik&background=EE0000&color=fff&size=80',
      department: 'DevOps Team'
    },
    category: 'openshift',
    tags: ['containers', 'cicd', 'orchestration'],
    publishDate: '2024-01-03',
    readTime: 20,
    likes: 28,
    views: 312,
    thumbnailUrl: 'https://picsum.photos/seed/openshift-containers/400/200',
    isFavorite: false
  }
];