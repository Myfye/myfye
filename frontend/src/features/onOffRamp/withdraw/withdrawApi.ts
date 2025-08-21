import { MYFYE_BACKEND, MYFYE_BACKEND_KEY } from "@/env";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface CreatePayoutResponse {
  blindpay_quotation: number;
  commercial_quotation: number;
  expires_at: number;
  id: string;
  receiver_amount: number;
  sender_amount: number;
  contract: {
    abi: {}[];
    address: string;
    amount: string;
    blindpayContractAddress: string;
    functionName: "approve";
    network: {
      chainId: number;
      name: string;
    };
  } | null;
  description: string | null;
  flatFee: string | null;
  partnerFeeAmount: string | null;
  receiverLocalAmount: string | null;
}

interface CreatePayoutQuery {
  userId: string;
  bankAccountId: string;
  amount: number;
}

interface AddBankAccountResponse {
  id: string;
  name: string;
  type:
    | "wire"
    | "ach"
    | "pix"
    | "spei_bitso"
    | "transfers_bitso"
    | "ach_cop_bitso"
    | "international_swift"
    | "rtp";
  account_class: "individual" | "business" | null;
  account_number: string | null;
  account_type: "checking" | "saving" | null;
  ach_cop_bank_account: string | null;
  ach_cop_bank_code: string | null;
  ach_cop_beneficiary_first_name: string | null;
  ach_cop_beneficiary_last_name: string | null;
  ach_cop_document_id: string | null;
  ach_cop_document_type: "CC" | "CE" | "NIT" | "PASS" | "PEP" | null;
  ach_cop_email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  beneficiary_name: string | null;
  city: string | null;
  country:
    | "AF"
    | "AL"
    | "DZ"
    | "AS"
    | "AD"
    | "AO"
    | "AI"
    | "AQ"
    | "AG"
    | "AR"
    | "AM"
    | "AW"
    | "AU"
    | "AT"
    | "AZ"
    | "BS"
    | "BH"
    | "BD"
    | "BB"
    | "BY"
    | "BE"
    | "BZ"
    | "BJ"
    | "BM"
    | "BT"
    | "BO"
    | "BQ"
    | "BA"
    | "BW"
    | "BV"
    | "BR"
    | "IO"
    | "BN"
    | "BG"
    | "BF"
    | "BI"
    | "CV"
    | "KH"
    | "CM"
    | "CA"
    | "KY"
    | "CF"
    | "TD"
    | "CL"
    | "CN"
    | "CX"
    | "CC"
    | "CO"
    | "KM"
    | "CD"
    | "CG"
    | "CK"
    | "CR"
    | "HR"
    | "CU"
    | "CW"
    | "CY"
    | "CZ"
    | "CI"
    | "DK"
    | "DJ"
    | "DM"
    | "DO"
    | "EC"
    | "EG"
    | "SV"
    | "GQ"
    | "ER"
    | "EE"
    | "SZ"
    | "ET"
    | "FK"
    | "FO"
    | "FJ"
    | "FI"
    | "FR"
    | "GF"
    | "PF"
    | "TF"
    | "GA"
    | "GM"
    | "GE"
    | "DE"
    | "GH"
    | "GI"
    | "GR"
    | "GL"
    | "GD"
    | "GP"
    | "GU"
    | "GT"
    | "GG"
    | "GN"
    | "GW"
    | "GY"
    | "HT"
    | "HM"
    | "VA"
    | "HN"
    | "HK"
    | "HU"
    | "IS"
    | "IN"
    | "ID"
    | "IR"
    | "IQ"
    | "IE"
    | "IM"
    | "IL"
    | "IT"
    | "JM"
    | "JP"
    | "JE"
    | "JO"
    | "KZ"
    | "KE"
    | "KI"
    | "KP"
    | "KR"
    | "KW"
    | "KG"
    | "LA"
    | "LV"
    | "LB"
    | "LS"
    | "LR"
    | "LY"
    | "LI"
    | "LT"
    | "LU"
    | "MO"
    | "MG"
    | "MW"
    | "MY"
    | "MV"
    | "ML"
    | "MT"
    | "MH"
    | "MQ"
    | "MR"
    | "MU"
    | "YT"
    | "MX"
    | "FM"
    | "MD"
    | "MC"
    | "MN"
    | "ME"
    | "MS"
    | "MA"
    | "MZ"
    | "MM"
    | "NA"
    | "NR"
    | "NP"
    | "NL"
    | "NC"
    | "NZ"
    | "NI"
    | "NE"
    | "NG"
    | "NU"
    | "NF"
    | "MP"
    | "NO"
    | "OM"
    | "PK"
    | "PW"
    | "PS"
    | "PA"
    | "PG"
    | "PY"
    | "PE"
    | "PH"
    | "PN"
    | "PL"
    | "PT"
    | "PR"
    | "QA"
    | "MK"
    | "RO"
    | "RU"
    | "RW"
    | "RE"
    | "BL"
    | "SH"
    | "KN"
    | "LC"
    | "MF"
    | "PM"
    | "VC"
    | "WS"
    | "SM"
    | "ST"
    | "SA"
    | "SN"
    | "RS"
    | "SC"
    | "SL"
    | "SG"
    | "SX"
    | "SK"
    | "SI"
    | "SB"
    | "SO"
    | "ZA"
    | "GS"
    | "SS"
    | "ES"
    | "LK"
    | "SD"
    | "SR"
    | "SJ"
    | "SE"
    | "CH"
    | "SY"
    | "TW"
    | "TJ"
    | "TZ"
    | "TH"
    | "TL"
    | "TG"
    | "TK"
    | "TO"
    | "TT"
    | "TN"
    | "TR"
    | "TM"
    | "TC"
    | "TV"
    | "UG"
    | "UA"
    | "AE"
    | "GB"
    | "UM"
    | "US"
    | "UY"
    | "UZ"
    | "VU"
    | "VE"
    | "VN"
    | "VG"
    | "VI"
    | "WF"
    | "EH"
    | "YE"
    | "ZM"
    | "ZW"
    | "AX"
    | null;
  pix_key: string | null;
  postal_code: string | null;
  routing_number: string | null;
  spei_clabe: string | null;
  spei_institution_code: string | null;
  spei_protocol: "clabe" | "debitcard" | "phonenum" | null;
  state_province_region: string | null;
  swift_account_holder_name: string | null;
  swift_account_number_iban: string | null;
  swift_bank_address_line_1: string | null;
  swift_bank_address_line_2: string | null;
  swift_bank_city: string | null;
  swift_bank_country: "AF" | "AL" | "DZ" | "AS" | "AD" | null;
  swift_bank_name: string | null;
  swift_bank_postal_code: string | null;
  swift_bank_state_province_region: string | null;
  swift_beneficiary_address_line_1: string | null;
  swift_beneficiary_address_line_2: string | null;
  swift_beneficiary_city: string | null;
  swift_beneficiary_country: null;
  swift_beneficiary_postal_code: string | null;
  swift_beneficiary_state_province_region: string | null;
  swift_code_bic: string | null;
  swift_intermediary_bank_account_number_iban: string | null;
  swift_intermediary_bank_country:
    | "AF"
    | "AL"
    | "DZ"
    | "AS"
    | "AD"
    | "AO"
    | "AI"
    | "AQ"
    | "AG"
    | "AR"
    | "AM"
    | "AW"
    | "AU"
    | "AT"
    | "AZ"
    | "BS"
    | "BH"
    | "BD"
    | "BB"
    | "BY"
    | "BE"
    | "BZ"
    | "BJ"
    | "BM"
    | "BT"
    | "BO"
    | "BQ"
    | "BA"
    | "BW"
    | "BV"
    | "BR"
    | "IO"
    | "BN"
    | "BG"
    | "BF"
    | "BI"
    | "CV"
    | "KH"
    | "CM"
    | "CA"
    | "KY"
    | "CF"
    | "TD"
    | "CL"
    | "CN"
    | "CX"
    | "CC"
    | "CO"
    | "KM"
    | "CD"
    | "CG"
    | "CK"
    | "CR"
    | "HR"
    | "CU"
    | "CW"
    | "CY"
    | "CZ"
    | "CI"
    | "DK"
    | "DJ"
    | "DM"
    | "DO"
    | "EC"
    | "EG"
    | "SV"
    | "GQ"
    | "ER"
    | "EE"
    | "SZ"
    | "ET"
    | "FK"
    | "FO"
    | "FJ"
    | "FI"
    | "FR"
    | "GF"
    | "PF"
    | "TF"
    | "GA"
    | "GM"
    | "GE"
    | "DE"
    | "GH"
    | "GI"
    | "GR"
    | "GL"
    | "GD"
    | "GP"
    | "GU"
    | "GT"
    | "GG"
    | "GN"
    | "GW"
    | "GY"
    | "HT"
    | "HM"
    | "VA"
    | "HN"
    | "HK"
    | "HU"
    | "IS"
    | "IN"
    | "ID"
    | "IR"
    | "IQ"
    | "IE"
    | "IM"
    | "IL"
    | "IT"
    | "JM"
    | "JP"
    | "JE"
    | "JO"
    | "KZ"
    | "KE"
    | "KI"
    | "KP"
    | "KR"
    | "KW"
    | "KG"
    | "LA"
    | "LV"
    | "LB"
    | "LS"
    | "LR"
    | "LY"
    | "LI"
    | "LT"
    | "LU"
    | "MO"
    | "MG"
    | "MW"
    | "MY"
    | "MV"
    | "ML"
    | "MT"
    | "MH"
    | "MQ"
    | "MR"
    | "MU"
    | "YT"
    | "MX"
    | "FM"
    | "MD"
    | "MC"
    | "MN"
    | "ME"
    | "MS"
    | "MA"
    | "MZ"
    | "MM"
    | "NA"
    | "NR"
    | "NP"
    | "NL"
    | "NC"
    | "NZ"
    | "NI"
    | "NE"
    | "NG"
    | "NU"
    | "NF"
    | "MP"
    | "NO"
    | "OM"
    | "PK"
    | "PW"
    | "PS"
    | "PA"
    | "PG"
    | "PY"
    | "PE"
    | "PH"
    | "PN"
    | "PL"
    | "PT"
    | "PR"
    | "QA"
    | "MK"
    | "RO"
    | "RU"
    | "RW"
    | "RE"
    | "BL"
    | "SH"
    | "KN"
    | "LC"
    | "MF"
    | "PM"
    | "VC"
    | "WS"
    | "SM"
    | "ST"
    | "SA"
    | "SN"
    | "RS"
    | "SC"
    | "SL"
    | "SG"
    | "SX"
    | "SK"
    | "SI"
    | "SB"
    | "SO"
    | "ZA"
    | "GS"
    | "SS"
    | "ES"
    | "LK"
    | "SD"
    | "SR"
    | "SJ"
    | "SE"
    | "CH"
    | "SY"
    | "TW"
    | "TJ"
    | "TZ"
    | "TH"
    | "TL"
    | "TG"
    | "TK"
    | "TO"
    | "TT"
    | "TN"
    | "TR"
    | "TM"
    | "TC"
    | "TV"
    | "UG"
    | "UA"
    | "AE"
    | "GB"
    | "UM"
    | "US"
    | "UY"
    | "UZ"
    | "VU"
    | "VE"
    | "VN"
    | "VG"
    | "VI"
    | "WF"
    | "EH"
    | "YE"
    | "ZM"
    | "ZW"
    | "AX"
    | null;
  swift_intermediary_bank_swift_code_bic: string | null;
  transfers_account: string | null;
  transfers_type: "CVU" | "CBU" | "ALIAS" | null;
  tron_wallet_hash: string | null;
}

interface AddBankAccountQuery {
  userId: string;
  receiverId: string;
  accountName: string;
  beneficiaryName: string;
  speiInstitutionCode: string;
  speiClabe: string;
  type: "spei_bitso";
  speiProtocol: "clabe";
}

export const withdrawApi = createApi({
  reducerPath: "withdrawApi",
  tagTypes: ["Withdraw", "BankAccounts"],
  baseQuery: fetchBaseQuery({
    baseUrl: MYFYE_BACKEND,
    prepareHeaders: (headers) => {
      headers.set("x-api-key", MYFYE_BACKEND_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    createPayout: build.query<CreatePayoutResponse, CreatePayoutQuery>({
      query: ({ userId, bankAccountId, amount }) => {
        return {
          url: `/create_payout`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            user_id: userId,
            bank_account_id: bankAccountId,
            currency_type: "sender",
            cover_fees: false,
            request_amount: amount,
          },
        };
      },
    }),
    addBankAccount: build.query<AddBankAccountResponse, AddBankAccountQuery>({
      query: ({
        userId,
        receiverId,
        accountName,
        beneficiaryName,
        speiInstitutionCode,
        speiClabe,
        type = "spei_bitso",
        speiProtocol = "clabe",
      }) => {
        return {
          url: `/add_bank_account`,
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: {
            user_id: userId,
            receiver_id: receiverId,
            name: accountName,
            beneficiary_name: beneficiaryName,
            spei_institution_code: speiInstitutionCode,
            spei_clabe: speiClabe,
            type,
            spei_protocol: speiProtocol,
          },
        };
      },
      transformResponse: (response: any) => {
        console.log('🔍 withdrawApi - addBankAccount transformResponse called with:', response);
        
        // Check if the response indicates an error
        if (response && response.success === false) {
          console.log('❌ withdrawApi - Response indicates failure:', response);
          // Don't throw here, let the error handling in the component deal with it
          // This allows us to access the detailed error information
          return response;
        }
        
        console.log('✅ withdrawApi - Response indicates success:', response);
        return response;
      },
      invalidatesTags: (result, error, { userId }) => [
        { type: 'BankAccounts', id: userId }
      ],
    }),
  }),
});

export const {
  useCreatePayoutQuery,
  useLazyCreatePayoutQuery,
  useLazyAddBankAccountQuery,
} = withdrawApi;
