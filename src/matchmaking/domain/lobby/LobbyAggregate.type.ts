import { AggregateRoot } from '#common/domain/aggregate/AggregateRoot';
import { ILobby } from './ILobby';

export type LobbyAggregate = ILobby & AggregateRoot;
