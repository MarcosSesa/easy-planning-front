import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';
import { BaseResponse } from 'app/data/dto/common/base-response.dto';
import {
  AcceptMemberBodyDto,
  AcceptMemberResponseDto,
} from 'app/data/dto/member/accept-member.dto';
import {
  CreateMemberBodyDto,
  CreateMemberResponseDto,
} from 'app/data/dto/member/create-memeber.dto';
import { PendingMembersResponseDto } from 'app/data/dto/member/pending-member.dto';

@Injectable({
  providedIn: 'root',
})
export class MemberRepository {
  readonly #url = environment.easyPlaningsBackUrl;
  readonly #httpClient = inject(HttpClient);

  createMember(body: CreateMemberBodyDto) {
    return this.#httpClient.post<BaseResponse<CreateMemberResponseDto>>(
      `${this.#url}/members/create`,
      body,
    );
  }

  getPendingMembers() {
    return this.#httpClient.get<BaseResponse<PendingMembersResponseDto[]>>(
      `${this.#url}/members/invitations`,
    );
  }

  acceptMember(body: AcceptMemberBodyDto) {
    return this.#httpClient.patch<BaseResponse<AcceptMemberResponseDto>>(
      `${this.#url}/members/resolve-membership`,
      body,
    );
  }
}
