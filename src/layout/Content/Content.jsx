import "./Content.css";
import ContentTop from '../../components/ContentTop/ContentTop';
import ContentMain from '../../components/ContentMain/ContentMain';
import { Outlet } from "react-router-dom";

const Content = () => {
  return (
    <>    <div className='main-content'>
      <ContentTop />
      {/* <ContentMain /> */}
 
    </div>
         <div style={{padding:'25px'}}>
         <Outlet/>
         </div>
         </>

  )
}

export default Content
