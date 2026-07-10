import EmptyState from "@/components/EmptyState";
import getCurrentUser from "@/actions/getCurrentUser";
import getReservationById from "@/actions/getReservationById";
import TripDetailsClient from "./TripDetailsClient";

interface IParams {
  reservationId?: string;
}

const TripDetailsPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please login to view trip details."
      />
    );
  }

  if (!params.reservationId) {
    return (
      <EmptyState
        title="Invalid Booking"
        subtitle="The booking ID is invalid."
      />
    );
  }

  const reservation = await getReservationById({ reservationId: params.reservationId });

  if (!reservation) {
    return (
      <EmptyState
        title="Trip Not Found"
        subtitle="This booking could not be found."
      />
    );
  }

  // Ensure only the person who booked the trip (or host) can see this
  if (reservation.userId !== currentUser.id && reservation.listing?.userId !== currentUser.id) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You are not authorized to view this trip."
      />
    );
  }

  return (
    <TripDetailsClient
      reservation={reservation}
      currentUser={currentUser}
    />
  );
};

export default TripDetailsPage;
