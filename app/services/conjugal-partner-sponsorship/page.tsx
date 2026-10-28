import ServiceDetailPage from "../service-detail-page";
import { serviceDetails } from "../service-content";

export default function ServicePage() {
  return <ServiceDetailPage service={serviceDetails["conjugal-partner-sponsorship"]} />;
}
