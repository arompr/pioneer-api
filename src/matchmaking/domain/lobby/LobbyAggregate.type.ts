import { IEventSourcedAggregate } from '#common/domain/aggregate/IEventSourcedAggregate';
import { ILobby } from './ILobby';

export type LobbyAggregate = ILobby & IEventSourcedAggregate;
