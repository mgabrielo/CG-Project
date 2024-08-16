<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";
import FormInput from "@/components/formInput.vue";
import axios from "axios";
import { initialUser, initialAddress, initialValidation } from "@/core";
import { createClaim } from "@/core/createClaim";
import { User, Address } from "@/types";

export default Vue.extend({
  name: "FormView",
  components: {
    FormComponent,
    TextComponent,
    SubmitComponent,
    FormInput,
  },
  data() {
    return {
      addresses: [initialAddress] as Address[],
      showAddAddressButton: false,
      ipAddress: "",
      userId: "",
      user: initialUser as User,
      numOfAddressYears: 0,
      dismissSecs: 10,
      dismissCountDown: 0,
      showDismissibleAlert: false,
    };
  },
  mounted() {
    this.updateUserData(); // Fetch and set user data
    this.getIpAddress();
  },
  computed: {
    // Computed property to calculate the number of years in the address history
    addressHistoryYears(): number {
      if (this.addresses.length === 0) return 0;

      // Convert the dates to Date objects and sort them in ascending order
      const dates = this.addresses
        .map((address: Address) => new Date(address.dateMovedIn || ""))
        .sort((a: Date, b: Date) => a.getTime() - b.getTime());

      if (dates.length === 0) return 0; // If no valid dates, return 0

      const earliestDate = dates[0];
      const currentDate = new Date(); // Use the current date

      // Calculate the difference in years
      const yearDiff = currentDate.getFullYear() - earliestDate.getFullYear();

      // Account for the possibility of partial years
      const monthDiff = currentDate.getMonth() - earliestDate.getMonth();
      const dayDiff = currentDate.getDate() - earliestDate.getDate();

      return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
        ? yearDiff - 1
        : yearDiff;
    },
  },
  watch: {
    // Watch for changes in the `addresses` array, specifically the `dateMovedIn` property
    addresses: {
      handler: function (newAddresses) {
        const lastAddress = newAddresses[newAddresses.length - 1];
        if (lastAddress && lastAddress.dateMovedIn) {
          const dateMovedIn = new Date(lastAddress.dateMovedIn);
          const threeYearsAgo = new Date();
          threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
          // Show the add address button if the move-in date is less than 3 years ago
          this.showAddAddressButton = dateMovedIn > threeYearsAgo;
        } else {
          this.showAddAddressButton = false;
        }
      },
      deep: true, // Watch deeply to track changes within the objects in the array
    },
    $route: {
      handler(newRoute, oldRoute) {
        this.userId = this.getUserId();
        this.updateUserData();
        this.resetForm();
      },
      immediate: true, // Execute immediately on component load
    },
  },
  methods: {
    getUserId() {
      return this.$route.params.userId;
    },
    async updateUserData() {
      try {
        if (this.userId) {
          await this.$store.dispatch("fetchUser", this.userId);
          this.user = (this.$store.state.user[0] || initialUser) as User;
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        this.user = initialUser; // Fallback to initial user
      }
    },
    async getIpAddress() {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        if (response.data) {
          this.ipAddress = response.data.ip;
        }
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    },
    async fetchPostcodes(addressIndex: number) {
      const postcode = this.addresses[addressIndex].postcode;
      if (postcode.length > 2) {
        try {
          const response = await axios.get(
            `https://api.postcodes.io/postcodes?q=${postcode}`
          );
          if (response.data) {
            this.$set(
              this.addresses[addressIndex],
              "postcodes",
              response.data.result.map((item: any) => item.postcode)
            );
          }
        } catch (error) {
          console.error("Error fetching postcodes:", error);
          this.$set(this.addresses[addressIndex], "postcodes", []);
        }
      } else {
        this.$set(this.addresses[addressIndex], "postcodes", []);
      }
    },
    selectPostcode(addressIndex: number, postcode: string) {
      this.$set(this.addresses[addressIndex], "postcode", postcode);
      this.$set(this.addresses[addressIndex], "postcodes", []);
    },
    validateAddress(address: any) {
      let isValid = true;
      address.validationErrors = initialValidation;

      if (!address.addressLine) {
        address.validationErrors.addressLine = `Address Line is required.`;
        isValid = false;
      } else if (!address.postcode) {
        address.validationErrors.postcode = "Postcode is required.";
        isValid = false;
      } else if (!address.dateMovedIn) {
        address.validationErrors.dateMovedIn = "Date Moved In is required.";
        isValid = false;
      }
      return isValid;
    },
    addAddress() {
      const lastAddress = this.addresses[this.addresses.length - 1];
      // Validate the last address before adding a new one
      if (this.validateAddress(lastAddress)) {
        this.addresses.push({
          addressLine: "",
          postcode: "",
          dateMovedIn: null,
          postcodes: [],
          validationErrors: {
            addressLine: "",
            postcode: "",
            dateMovedIn: "",
          },
        });
        this.showAddAddressButton = false; // Hide the button after adding a new address
      }
    },
    dateDisabled(ymd: Date, date: Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset the time part to 00:00:00
      if (date.getTime() > today.getTime()) {
        return true;
      }
    },
    async onSubmit() {
      let allValid = true;
      this.numOfAddressYears = this.addressHistoryYears;
      console.log(this.numOfAddressYears);
      // Validate all addresses
      for (const address of this.addresses) {
        if (!this.validateAddress(address)) {
          allValid = false;
        }
      }
      if (!allValid) {
        console.log("Validation failed. Please correct the errors.");
        return;
      }
      try {
        if (
          this.$route.params.userId &&
          this.ipAddress &&
          this.numOfAddressYears > 3
        ) {
          await createClaim(
            this.$route.params.userId,
            this.ipAddress,
            this.addresses
          );
          this.showAlert();
        } else {
          console.log("Form not authorised to submit successfully!");
        }
        this.resetForm();
      } catch (error) {
        this.resetForm();
        console.log(error);
      }
    },
    resetForm() {
      this.addresses = [
        {
          addressLine: "",
          postcode: "",
          dateMovedIn: null,
          postcodes: [],
          validationErrors: {
            addressLine: "",
            postcode: "",
            dateMovedIn: "",
          },
        },
      ];
      this.user = initialUser;
      this.showAddAddressButton = false;
      this.numOfAddressYears = 0;
    },
    countDownChanged(dismissCountDown: number) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
  },
});
</script>

<template>
  <div class="container mt-5">
    <b-alert
      :show="dismissCountDown"
      variant="success"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="countDownChanged"
    >
      <p>
        Form Submitted successfully, Alert closes in
        {{ dismissCountDown }} seconds...
      </p>
      <b-progress
        variant="success"
        :max="dismissSecs"
        :value="dismissCountDown"
        height="4px"
      ></b-progress>
    </b-alert>
    <FormComponent>
      <!-- Title -->
      <template #title>
        <TextComponent
          :text="
            user.firstName !== null && user.lastName !== null
              ? `Welcome,${user.firstName} ${user.lastName}`
              : 'Welcome'
          "
          type="h2"
          class="text-center mb-4"
        />
      </template>

      <!-- Subtitle -->
      <template #subtitle>
        <TextComponent
          text="Please fill out the on-boarding form with 3 years of address details"
          type="h5"
          class="text-center mb-4"
        />
      </template>

      <template #question>
        <div v-for="(address, index) in addresses" :key="index" class="mb-4">
          <FormInput
            :label="'Address Line ' + (index + 1)"
            :input-id="'input-address-' + (index + 1)"
            :error="address.validationErrors.addressLine"
            v-model="address.addressLine"
            placeholder="Enter your Address"
            :inputRef="'address'"
          />

          <FormInput
            :label="'Postcode'"
            :input-id="'input-postcode-' + index"
            :error="address.validationErrors.postcode"
            v-model="address.postcode"
            :placeholder="'Enter your Postcode'"
            @input="fetchPostcodes(index)"
            :inputRef="'postcode'"
          >
            <b-dropdown
              v-if="address.postcodes.length"
              :text="address.postcode"
              class="w-100"
              @change="selectPostcode(index, address.postcode)"
            >
              <b-dropdown-item
                v-for="(postcode, pIndex) in address.postcodes"
                :key="pIndex"
                @click="selectPostcode(index, postcode)"
              >
                {{ postcode }}
              </b-dropdown-item>
            </b-dropdown>
          </FormInput>

          <FormInput
            :label="'Date Moved In'"
            :input-id="'datepicker-' + index"
            :error="address.validationErrors.dateMovedIn"
          >
            <b-form-datepicker
              :id="'datepicker-' + index"
              v-model="address.dateMovedIn"
              menu-class="w-50"
              calendar-width="100%"
              class="d-flex mb-2"
              :date-disabled-fn="dateDisabled"
              :date-format-options="{
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              }"
              locale="en"
            ></b-form-datepicker>
          </FormInput>
        </div>

        <!-- Add Address Button -->
        <div v-if="showAddAddressButton" class="text-center mt-3">
          <b-button variant="primary" @click="addAddress"
            >Add Another Address</b-button
          >
        </div>
      </template>

      <!-- Submit Button -->
      <template #submit>
        <div class="text-center mt-4">
          <SubmitComponent @submitForm="onSubmit" />
        </div>
      </template>
    </FormComponent>
  </div>
</template>
