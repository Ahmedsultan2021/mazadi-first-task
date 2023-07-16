<template>
  <div>
    <label>Main Category:</label>
    <select v-model="selectedMainCategory" @change="getSubcategories">
      <option v-for="category in mainCategories" :value="category.id" :key="category.id">
        {{ category.name }}
      </option>
    </select>

    <label>Subcategory:</label>
    <select v-model="selectedSubcategory" @change="getProperties">
      <option v-for="subcategory in subcategories" :value="subcategory.id" :key="subcategory.id">
        {{ subcategory.name }}
      </option>
    </select>

    <div v-for="(property, index) in properties.slice(0, 3)" :key="index">
      <label>{{ property.name }}:</label>
      <select v-model="selectedProperties[index]" @change="fetchChildOptions(property, index)">
        <option v-for="option in property.options" :value="option.id" :key="option.id">
          {{ option.name }}
        </option>
        <option value="other">Other</option>
        <option value=""  ></option>
      </select>

      <input v-if="selectedProperties[index] === 'other'" type="text" v-model="otherValues[index]" />
    </div>

    <div v-if="options.length">
      <label>Model:</label>
      <select id="x" v-model="selectedOption">
        <option v-for="option in options" :value="option.id" :key="option.id">
          {{ option.name }}
        </option>
        <option value="other">Other</option>
      </select>
    </div>

    <button @click="submitForm">Submit</button>

    <div class="container mx-auto px-12 ">
      <table v-if="submitted" class="w-2/4">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Main Category:</td>
            <td>{{ mainCategories[selectedMainCategory]?.name }}</td>
          </tr>
          <tr v-for="(property, index) in selectedProperties" :key="index">
            <td>{{ properties[index]?.name }}</td>
            <td>
              {{
                property === 'other'
                  ? otherValues[index]
                  : properties[index]?.options.find((opt) => opt.id === property)?.name || ''
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from '../../axios.config';

const API_URL_ALL_CATEGORIES = 'https://staging.mazaady.com/api/v1/get_all_cats';
const API_URL_PROPERTIES = 'https://staging.mazaady.com/api/v1/properties?cat=';
const API_URL_OPTIONS_CHILD = 'https://staging.mazaady.com/api/v1/get-options-child/';

export default {
  data() {
    return {
      privateApiKey: '3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16',
      mainCategories: [],
      selectedMainCategory: '',
      subcategories: [],
      selectedSubcategory: '',
      selectedOption: '',
      properties: [],
      selectedProperties: [],
      otherValues: [],
      submitted: false,
      options: [],
    };
  },
  mounted() {
    this.getMainCategories();
  },
  methods: {
    async getMainCategories() {
      try {
        const response = await axios.get(API_URL_ALL_CATEGORIES, {
          headers: {
            'private-key': this.privateApiKey,
          },
        });
        this.mainCategories = response.data.data.categories;
      } catch (error) {
        console.error(error);
      }
    },
    async getSubcategories() {
      const selectedCategory = this.mainCategories.find((category) => category.id === this.selectedMainCategory);
      this.subcategories = selectedCategory?.children || [];
    },
    async getProperties() {
          this.selectedProperties = ['', '', ''];

      this.otherValues = [];
      this.options = [];
      this.selectedOption = '';
      try {
        const apiUrl = `${API_URL_PROPERTIES}${this.selectedSubcategory}`;
        const response = await axios.get(apiUrl, {
          headers: {
            'private-key': this.privateApiKey,
          },
        });
        this.properties = response.data.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchChildOptions(property, index) {
      const selectedProperty = this.selectedProperties[index];
      if (property.name === 'Brand' && selectedProperty !== 'other') {
        try {
          const apiUrl = `${API_URL_OPTIONS_CHILD}${selectedProperty}`;
          const response = await axios.get(apiUrl, {
            headers: {
              'private-key': this.privateApiKey,
            },
          });
          this.options = response.data.data[0]?.options || [];
        } catch (error) {
          console.error(error);
        }
      }
    },
    submitForm() {
      this.submitted = true;
    },
  },
};
</script>
<style scoped>
label {
  display: block;
  margin-bottom: 10px;
}

select,
input[type="text"] {
  margin-bottom: 10px;
  padding: 5px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}
input,
select,
option {
  display: block;
  margin: 10px auto;
  width: 50vw;
}
</style>
