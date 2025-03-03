import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import axios from "axios";

const AdminPage: React.FC = () => {
  const [apis, setApis] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gameCategory, setGameCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toggledImage, setToggledImage] = useState<string | null>(null);

  useEffect(() => {
    fetchApis();
    fetchCategories();
  }, []);

  const fetchApis = async () => {
    setLoading(true);
    try {
      const API_URL = "https://zoey-back-production.up.railway.app";
      const response = await axios.get(`${API_URL}/api/allApis`);
            setApis(response.data.allApis);
    } catch (error) {
      setToastMessage("Failed to load APIs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const API_URL = "https://zoey-back-production.up.railway.app";
      const response = await axios.get(`${API_URL}/category/all`);
      console.log("Categories fetched:", response.data.allCategories); // Debugging
      setCategories(response.data.allCategories || []);
    } catch (error) {
      setToastMessage("Failed to load categories.");
      console.error("Error fetching categories:", error);
    }
  };

  const API_URL = "https://zoey-back-production.up.railway.app";

  const handleAddApi = async () => {
    if (!apiName || !apiUrl) {
      setToastMessage("API Name and URL are required!");
      return;
    }
  
    try {
      let categoryIdToUse = gameCategory;
      let categoryNameToUse = "";
  
      if (customCategory) {
        const newCategory = await axios.post(`${API_URL}/category/add`, {
          name: customCategory,
        });
  
        categoryIdToUse = newCategory.data._id;
        categoryNameToUse = customCategory;
      } else {
        const selectedCategory = categories.find(
          (category) => category._id === gameCategory
        );
        if (selectedCategory) {
          categoryNameToUse = selectedCategory.name;
        }
      }
  
      await axios.post(`${API_URL}/api/add`, {
        api_name: apiName,
        api_url: apiUrl,
        api_image: imageUrl || "/default-thumbnail.jpg",
        categoryId: categoryIdToUse || "",
        game_category: categoryNameToUse || "", 
      });
  
      // Reset form fields
      setApiName("");
      setApiUrl("");
      setImageUrl("");
      setGameCategory("");
      setCustomCategory("");
  
      // Refresh the APIs list
      fetchApis();
      setToastMessage("API added successfully!");
    } catch (error) {
      setToastMessage("Failed to add API.");
    }
  };
  
  const handleAddCategory = async () => {
    if (!newCategory) {
      setToastMessage("Category name is required!");
      return;
    }
    try {
      const API_URL = "https://zoey-back-production.up.railway.app";
      const response = await axios.post(`${API_URL}/category/add`, {
        name: newCategory,
      });
      setCategories([...categories, response.data.result]);
      setNewCategory("");
      setToastMessage("Category added successfully!");
    } catch (error) {
      setToastMessage("Failed to add category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const API_URL = "https://zoey-back-production.up.railway.app";
      await axios.delete(`${API_URL}/category/delete/${id}`);
            setCategories(categories.filter((category) => category._id !== id));
      setToastMessage("Category deleted successfully!");
    } catch (error) {
      setToastMessage("Failed to delete category.");
    }
  };

  const handleDeleteApi = async (id: string) => {
    try {
      const API_URL = "https://zoey-back-production.up.railway.app";
      await axios.delete(`${API_URL}/api/delete/${id}`);
      fetchApis();
      setToastMessage("API deleted successfully!");
    } catch (error) {
      setToastMessage("Failed to delete API.");
    }
  };

  const toggleImage = (image: string) => {
    setToggledImage((prevImage) => (prevImage === image ? null : image));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Panel</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Add New Category Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add New Category</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              placeholder="Enter category name"
              value={newCategory}
              onIonChange={(e) => setNewCategory(e.detail.value!)}
            />
            <IonButton
              expand="full"
              className="ion-margin-top"
              onClick={handleAddCategory}
            >
              Add Category
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Add New API Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add New API</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              placeholder="API Name"
              value={apiName}
              onIonChange={(e) => setApiName(e.detail.value!)}
            />
            <IonInput
              placeholder="API URL"
              value={apiUrl}
              onIonChange={(e) => setApiUrl(e.detail.value!)}
            />
            <IonInput
              placeholder="Image URL (optional)"
              value={imageUrl}
              onIonChange={(e) => setImageUrl(e.detail.value!)}
            />

            {/* Dropdown for predefined categories */}
            <IonSelect
              placeholder="Select Category (optional)"
              value={gameCategory}
              onIonChange={(e) => setGameCategory(e.detail.value)}
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <IonSelectOption key={category._id} value={category._id}>
                    {category.name}
                  </IonSelectOption>
                ))
              ) : (
                <IonSelectOption value="" disabled>
                  No categories available
                </IonSelectOption>
              )}
            </IonSelect>

            {/* Display categories with delete buttons */}
            <IonList>
              {categories.map((category) => (
                <IonItem key={category._id}>
                  <IonLabel>{category.name}</IonLabel>
                  <IonButton
                    color="danger"
                    size="small"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </IonButton>
                </IonItem>
              ))}
            </IonList>

            <IonButton
              expand="full"
              className="ion-margin-top"
              onClick={handleAddApi}
            >
              Add API
            </IonButton>
          </IonCardContent>
        </IonCard>
        {loading && <IonSpinner name="crescent" className="ion-margin" />}
        {/* Existing APIs Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Existing APIs</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {apis.length === 0 ? (
              <IonLabel>No APIs available.</IonLabel>
            ) : (
<IonList>
  {apis.map((api) => (
    <IonItem key={api._id} className="api-item">
      <IonLabel>
        <strong>{api.api_name}</strong>
        <p>{api.api_url}</p>
        <p>Category: {api.categoryId ? api.categoryId.name : "N/A"}</p> {/* Display the category name */}
      </IonLabel>
      {api.api_image && api.api_image.startsWith("http") && (
        <img
          src={api.api_image}
          alt={api.api_name}
          width={toggledImage === api.api_image ? 250 : 70}
          height={toggledImage === api.api_image ? 250 : 70}
          onClick={() => toggleImage(api.api_image)}
          style={{
            cursor: "pointer",
            borderRadius: "10px",
            transition: "all 0.3s ease-in-out",
            boxShadow:
              toggledImage === api.api_image
                ? "0px 4px 10px rgba(0,0,0,0.2)"
                : "none",
            objectFit: "cover",
          }}
        />
      )}
      <IonButton
        color="danger"
        size="small"
        onClick={() => handleDeleteApi(api._id)}
      >
        Delete
      </IonButton>
    </IonItem>
  ))}
</IonList>
            )}
          </IonCardContent>
        </IonCard>
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
