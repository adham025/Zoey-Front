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
  IonReorderGroup,
  IonReorder,
} from "@ionic/react";
import axios from "axios";
const AdminPage: React.FC = () => {
  const [apis, setApis] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingApi, setEditingApi] = useState<any | null>(null);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [apiName, setApiName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gameCategory, setGameCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toggledImage, setToggledImage] = useState<string | null>(null);
  // const API_URL = "http://localhost:3000";
  const API_URL = "https://zoey-back-production.up.railway.app/";

  useEffect(() => {
    fetchApis();
    fetchCategories();
  }, []);

  const fetchApis = async () => {
    setLoading(true);
    try {
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
      const response = await axios.get(`${API_URL}/category/all`);
      console.log("Categories fetched:", response.data.allCategories);
      setCategories(response.data.allCategories || []);
    } catch (error) {
      setToastMessage("Failed to load categories.");
      console.error("Error fetching categories:", error);
    }
  };

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

  const handleUpdateApi = async () => {
    if (!editingApi.api_name || !editingApi.api_url) {
      setToastMessage("API Name and URL are required!");
      return;
    }
    const updatedApi = {
      ...editingApi,
      categoryId: editingApi.categoryId._id || editingApi.categoryId,
    };

    try {
      await axios.put(`${API_URL}/api/updateApi/${editingApi._id}`, updatedApi);
      setEditingApi(null);
      fetchApis();
      setToastMessage("API updated successfully!");
    } catch (error) {
      setToastMessage("Failed to update API.");
    }
  };
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const updatedCategory = {
      name: editingCategory.name,
    };

    try {
      const response = await fetch(
        `${API_URL}/category/updateCategory/${editingCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToastMessage("Category updated successfully!");
        setEditingCategory(null);
        fetchCategories(); // Refresh categories after update
      } else {
        alert(data.message || "Failed to update category.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while updating the category.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/category/delete/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
      setToastMessage("Category deleted successfully!");
    } catch (error) {
      setToastMessage("Failed to delete category.");
    }
  };

  const handleDeleteApi = async (id: string) => {
    try {
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

  // Handle Reorder
  const handleReorder = (event: CustomEvent) => {
    const reorderedCategories = event.detail.complete(categories);
    setCategories(reorderedCategories);
  };

  // Save Order to the Backend
  const saveOrder = async () => {
    setLoading(true);
    try {
      const updatedCategories = categories.map((category, index) => ({
        _id: category._id,
        order: index + 1,
      }));

      const response = await axios.put(`${API_URL}/category/reorder`, {
        updatedCategories,
      });
      setToastMessage(response.data.message);
    } catch (error) {
      setToastMessage("Failed to save the reordered categories.");
      console.error("Error saving order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Reorder
  const handleReorderApis = (event: CustomEvent) => {
    const reorderedApis = event.detail.complete(apis);
    setApis(reorderedApis);
  };

  // Save Order to the Backend
  const saveOrderApis = async () => {
    setLoading(true);
    try {
      const updatedApis = apis.map((api, index) => ({
        _id: api._id,
        order: index + 1,
      }));

      const response = await axios.patch(`${API_URL}/api/reorder`, {
        updatedApis,
      });
      setToastMessage(response.data.message);
    } catch (error) {
      setToastMessage("Failed to save the reordered APIs.");
      console.error("Error saving order:", error);
    } finally {
      setLoading(false);
    }
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
              <IonReorderGroup
                disabled={false}
                onIonItemReorder={handleReorder}
              >
                {categories.map((category) => (
                  <IonItem key={category._id}>
                    <IonReorder slot="start" />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexGrow: 1,
                      }}
                    >
                      <IonLabel
                        style={{ minWidth: "30px", textAlign: "center" }}
                      >
                        {category.order}
                      </IonLabel>
                      <IonLabel>{category.name}</IonLabel>
                    </div>

                    <IonButton
                      color="primary"
                      size="small"
                      onClick={() => setEditingCategory(category)}
                    >
                      Edit
                    </IonButton>

                    <IonButton
                      color="danger"
                      size="small"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </IonButton>
                  </IonItem>
                ))}
              </IonReorderGroup>
            </IonList>

            <IonButton expand="block" onClick={saveOrder}>
              Save Order
            </IonButton>
            {editingCategory && (
              <>
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Edit Category</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonInput
                      placeholder="Category Name"
                      value={editingCategory.name}
                      onIonChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.detail.value!,
                        })
                      }
                    />

                    <IonButton
                      expand="full"
                      className="ion-margin-top"
                      onClick={handleUpdateCategory}
                    >
                      Save Changes
                    </IonButton>

                    <IonButton
                      expand="full"
                      color="medium"
                      className="ion-margin-top"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </>
            )}

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
        {/* Existing APIs Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Existing APIs</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {apis.length === 0 ? (
              <IonLabel>No APIs available.</IonLabel>
            ) : (
              <>
                <IonReorderGroup
                  disabled={false}
                  onIonItemReorder={handleReorderApis}
                >
                  {apis.map((api) => (
                    <IonItem key={api._id} className="api-item">
                      <IonReorder slot="start" />
                      <IonLabel>
                        <strong>{api.api_name}</strong>
                        <p>{api.api_url}</p>
                        <p>
                          Category:{" "}
                          {api.categoryId ? api.categoryId.name : "N/A"}
                        </p>
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
                        color="primary"
                        size="small"
                        onClick={() => setEditingApi(api)}
                      >
                        Edit
                      </IonButton>
                      <IonButton
                        color="danger"
                        size="small"
                        onClick={() => handleDeleteApi(api._id)}
                      >
                        Delete
                      </IonButton>
                    </IonItem>
                  ))}
                </IonReorderGroup>
                <IonButton expand="block" onClick={saveOrderApis}>
                  Save Order
                </IonButton>
              </>
            )}
            {editingApi && (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Edit API</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput
                    placeholder="API Name"
                    value={editingApi.api_name}
                    onIonChange={(e) =>
                      setEditingApi({
                        ...editingApi,
                        api_name: e.detail.value!,
                      })
                    }
                  />
                  <IonInput
                    placeholder="API URL"
                    value={editingApi.api_url}
                    onIonChange={(e) =>
                      setEditingApi({ ...editingApi, api_url: e.detail.value! })
                    }
                  />
                  <IonInput
                    placeholder="Image URL (optional)"
                    value={editingApi.api_image || ""}
                    onIonChange={(e) =>
                      setEditingApi({
                        ...editingApi,
                        api_image: e.detail.value!,
                      })
                    }
                  />

                  <IonSelect
                    value={editingApi.categoryId?._id || ""}
                    placeholder="Select Category"
                    onIonChange={(e) =>
                      setEditingApi({
                        ...editingApi,
                        categoryId: e.detail.value,
                      })
                    }
                  >
                    {categories.map((category) => (
                      <IonSelectOption key={category._id} value={category._id}>
                        {category.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>

                  <IonButton
                    expand="full"
                    className="ion-margin-top"
                    onClick={handleUpdateApi}
                  >
                    Update API
                  </IonButton>
                  <IonButton
                    expand="full"
                    color="medium"
                    className="ion-margin-top"
                    onClick={() => setEditingApi(null)}
                  >
                    Cancel
                  </IonButton>
                </IonCardContent>
              </IonCard>
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
