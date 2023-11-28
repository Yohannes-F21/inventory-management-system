// import AppHeader from "./Components/AppHeader";
import "./App.css";
// import AppFooter from "./Components/AppFooter";
import SideMenu from "./Components/SideMenu";
import PageContent from "./Components/pageContent";
function App() {
  return (
    <>
      <div className="App">
        {/* <AppHeader /> */}
        <div className="SideMenuAndPageContent bg-gray-200">
          <SideMenu></SideMenu>
          <PageContent></PageContent>
        </div>
      </div>
    </>
  );
}

export default App;
