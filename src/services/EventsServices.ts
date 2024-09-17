import PrismaClient from "../utils/PrismaClient";

class EventsServices {
  public events = PrismaClient.events;
  public users = PrismaClient.user;
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

  public findAnalytics = async (
    eventsNameList: { name: string; eventData?: any }[],
    organisationId: string,
    filter: any
  ) => {
    let analytics;
    Promise.all(
      eventsNameList.map(
        async (eventData: { name: string; eventData?: any }) => {
          const { id: eventId } = await this.events.findUnique({
            where: {
              name_organisationId: {
                name: eventData.name,
                organisationId: organisationId,
              },
            },
            select: {
              id: true,
            },
          });
          const shootedNumber = await this.eventsShooted.count({
            where: {
              AND: [
                {
                  eventId: eventId,
                },
                eventData
                  ? {
                      traits: {
                        contains: {
                          ...eventData,
                        },
                      },
                    }
                  : {},
                ...filter,
              ],
            },
          });
          analytics.push({
            eventName: eventData.name,
            count: shootedNumber,
          });
        }
      )
    );
    return analytics;
  };

  public shootEvent = async (
    eventData: any,
    eventName: string,
    organisationId: string,
    userId?: string
  ) => {
    /* steps are to check whether userId is given if not than we create a dummy user,
     then we check if the event is registered or not, if not then we register an then we create the event
     with the given event data
    */
    if (!userId) {
      const user = await this.users.create({
        data: {
          organisation: {
            connect: {
              id: organisationId,
            },
          },
        },
      });
      userId = user.id;
    }
    let { id: eventId } = await this.events.findUnique({
      where: {
        name_organisationId: {
          name: eventName,
          organisationId: organisationId,
        },
      },
    });
    if (!eventId) {
      const { id } = await this.events.create({
        data: {
          name: eventName,
          organisation: {
            connect: {
              id: organisationId,
            },
          },
        },
      });
      eventId = id;
    }
    const event = await this.eventsShooted.create({
      data: {
        traits: eventData,
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return event;
  };
}

export default EventsServices;
