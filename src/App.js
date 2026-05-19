// I placed this 3 here
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import ProtectedRoute from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import UserManagement from "./pages/UserManagement";
import JournalEntry from "./pages/JournalEntry";
import Accounts from "./pages/Accounts";
import TrialBalance from "./pages/TrialBalance";
import IncomeStatement from "./pages/IncomeStatement";
import BalanceSheet from "./pages/BalanceSheet";
import JournalEntryList from "./pages/JournalEntryList";
import GeneralLedger from "./pages/GeneralLedger";
import InvoiceList from "./pages/invoices/InvoiceList";
import InvoiceDetail from "./pages/invoices/InvoiceDetail";
import InvoiceForm from "./pages/invoices/InvoiceForm";
import BudgetDashboard from "./pages/budget/BudgetDashbord";
import BudgetDetails from "./pages/budget/BudgetDetails";
import AuditLogs from "./pages/audit/AuditLogs";
import CustomerList from "./pages/customers/CustomerList";
import CustomerForm from "./pages/customers/CustomerForm";
import VendorList from "./pages/vendors/VendorList";
import CreateVendor from "./pages/vendors/CreateVendor";
import OrganizationManagement from "./pages/superadmin/OrganizationManagement";
import Login from "./pages/Login";


// 🔐 AUTH CHECK FUNCTION (PUT IT HERE)
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        // Route to registration page
        <Route path="/register" element={<Register />} />

        // Route to login page
        <Route path="/" element={<Login />} />

        // Route to profile page
        <Route path="/profile" element={<Profile />} />
        
        // Route to dashboard, but check if authenticated first
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Login />} />

        // Route to user management page
        <Route path="/users" element={<UserManagement />} />

        // Route to journal entry page
        <Route path="/journal-entry" element={<JournalEntry />} />

        // Route to accounts page
        <Route path="/accounts" element={<Accounts />} />

        // Route to trial balance page
        <Route path="/trial-balance" element={<TrialBalance />} />

        // Route to income statement page
        <Route path="/income-statement" element={<IncomeStatement />} />

        // Route to balance sheet page
        <Route path="/balance-sheet" element={<BalanceSheet />} />

        // Route to journal entry list page
        <Route path="/journal-entries" element={<JournalEntryList />} />

        // Route to general ledger page
        <Route path="/general-ledger" element={<GeneralLedger />} />

        // Route to invoice list page
        <Route path="/invoices" element={<InvoiceList />} />
        
        // Route to invoice detail page
        <Route path="/invoices/:type/:id" element={<InvoiceDetail />} />
        
        // Route to budget dashboard page
        <Route path="/budgets" element={<BudgetDashboard />} />

        // Route to budget details page
        <Route path="/budgets/:id" element={<BudgetDetails />} />

        // Route to invoice creation page
        <Route path="/invoices/new" element={<InvoiceForm />} />

        // Route to audit logs page
        <Route path="/audit-logs" element={<AuditLogs />} />

        // Route to customer list page
        <Route path="/customers" element={<CustomerList />} />

        // Route to customer creation page
        <Route path="/customers/new" element={<CustomerForm />} />

        // Route to vendor list page
        <Route path="/vendors" element={<VendorList />} />

        // Route to vendor creation page
        <Route path="/vendors/create" element={<CreateVendor />} />

        // Route to organization management page
        <Route path="/organizations" element={<OrganizationManagement />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
