import Footer from 'components/Footer';
import Header from 'components/headers/Header';

const StaticPageLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default StaticPageLayout;
