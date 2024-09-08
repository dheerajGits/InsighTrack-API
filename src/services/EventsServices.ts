import PrismaClient from "../utils/PrismaClient";

class EventsServices {
  public events = PrismaClient.events;
  public eventsShooted = PrismaClient.shootedEvents;

  public findEventsByCompany = async (companyId: string, filter: any) => {
    const events = await this.events.findMany({
      where: {
        AND: [
          {
            ...filter,
          },
          {
            organisationId: companyId,
          },
        ],
      },
      select: {
        name: true,
        _count: {
          select: {
            ShootedEvents: true,
          },
        },
      },
    });
    const eventsData = events.map((event) => {
      return {
        name: event.name,
        noOfEventsShooted: event._count.ShootedEvents,
      };
    });
    return eventsData;
  };

  public findShootedEvents = async (
    companyId: string,
    eventName: string,
    filter: any
  ) => {
    const { id: eventId } = await this.events.findUnique({
      where: {
        name_organisationId: {
          name: eventName,
          organisationId: companyId,
        },
      },
    });
    const shootedEvents = await this.eventsShooted.findMany({
      where: {
        AND: [
          {
            eventId: eventId,
          },
          {
            ...filter,
          },
        ],
      },
      select: {
        user: {
          select: {
            name: true,
            traits: true,
          },
        },
      },
    });
    return shootedEvents;
  };
}
export default EventsServices;
