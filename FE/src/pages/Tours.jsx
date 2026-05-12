import TourNavbar from '../components/TOURS/NAVBAR/TourNavbar';
import ToursPosada from '../components/TOURS/CONTENEDORES/ToursPosada';
import ToursIsla from '../components/TOURS/CONTENEDORES/ToursIsla';
import Footer from '../components/INICIO/FOOTER/Footer';
function Tours() {
  // Ensure the page scrolls to top when loaded (unless there's a hash in the URL)


  return (
    <div>
      <TourNavbar />
      <ToursPosada />
      <ToursIsla />
      <Footer />
    </div>
  );
}

export default Tours;
