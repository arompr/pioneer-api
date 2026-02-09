export default abstract class DomainEvent {
    readonly occurredAt: Date;
    readonly name: string;

    protected constructor() {
        this.occurredAt = new Date();
        this.name = this.constructor.name;
    }
}
