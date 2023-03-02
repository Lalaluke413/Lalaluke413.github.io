---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
Decision trees are a powerful tool for many classification tasks across a variety of domains. One major challenge that decision tree models face is transferability from one dataset to another. Trasferalbility across datasets is the key to developing generalizable models. Prior approaches have tried to bound uncertainty and find the confidence interval of the decision tree boundaries. However, there approaches do not also take into consideration the data itself. Other that we will focus on here are in shifting the data itself. Many domain adaptation examples rely on optimal transport.
In this paper, we propose to use optimal transport to pre-process the data in the context of satellite images over various countries to asses their poverty level such that the training data used for a decision tree to asses poverty in one country can be transferred over to another. Specifically we will use Sinkhorn transport as preprocessing for our decision tree and evaluate our model based on other models.

# Introduction
One of the important issues in machine learning and many other domains today is the ability to train on one distribution and test on a different one. It is also called dataset shift. The problem of dataset shift can stem from the way input features are utilized, the way training and test sets are selected, data sparsity, shifts in the data distribution due to non-stationary environments, and also from changes in the activation patterns within layers of deep neural networks. Many companies are working on dealing with this problem, such as Amazon published a paper called CrossNorm and SelfNorm for generalization under distribution shifts in 2021 and Apple published a paper called Bridging the Domain Gap for Neural Model.

A different application of satellite imagery is poverty estimation across different spatial regions, which is essential for targeted humanitarian efforts in poor regions. However, ground-truth measurements of poverty are lacking for much of the developing world, as field surveys are expensive. One approach to this problem is to train ML models on countries with ground truth labels and then deploy them to different countries where we have satellite data but no labels. This is closely related to the problem of domain adaptation above and in this paper we will use the satellite images from the WILDS dataset to implement a domain adaptation by using optimal transport methods to train our models to predict the wealth index.

We tackle the problem of unsupervised domain adaptation wherein we assume we are not given the labels of our shifted data. Therefore, we must assume that there exists some nonlinear transformation such that the source domain matches the target domain. By using optimal transport, we assume that the minimal mapping between two distributions is the transformation taken between the distributions. Thus, we use optimal transport to study this domain adaptation.

# Methods
## Models
We wanted to see how domain adaptation using optimal transport would integrate into different machine learning models.
### Convolutional Neural Network
We implemented a convolutional neural network to predict the wealth index associated with an 8-channel satellite image.

|<center>8 channel to 48 channel 3x3 convolution</center>|
|<center>2x2 max pool</center>|
|<center>48 channel to 96 channel 3x3 convolution</center>|
|<center>2x2 max pool</center>|
|<center>96 channel to 1 channel 1x1 convolution</center>|
|<center>2x2 max pool</center>|
|<center>2196 to 120 linear layer</center>|
|<center>120 to 84 linear layer</center>|
|<center>84 to 1 linear layer</center>|

After training on the entire training set, and getting a MSE of .23 after 10 epochs. The variance of wealth index in the training set is .64, meaning without any domain adaptation the CNN could reduce variance by 64%. However, this performance was due to the large training sample size. In order to implement optimal transport for domain adaptation, would have to train on an individual country, and this dataset only has between 600 and 1000 images per country. This means that our performance, event just within that one country would be worse than one network trained on the entire dataset. We also considered training on a set of countries and transporting from any given country to the pixel distribution from the set of multiple countries. However, both the set of training countries and set of validation countries follow the same distribution of pixels anyway, so transporting would be pointless. We took this .23 MSE on the validation set as a benchmark for methods that would be better with optimal transport.

### Decision Tree
Our decision tree model is comprised of 4 parts:
1. Split the data between urban and rural, using given labels
2. Dimensionality reduction using distance from barycenters
3. Dimensionality reduction using principal component analysis
4. random forest of decision tree regressors

The input to this model is quite high, being a 8x224x224 image. In order
to reduce the dimensionality of the input while maintaining similarity between
similar images, used the distance from 1000 barycenters that were chosen using
k-means clustering.

Next, we simply used PCA to reduce the dimension of the input even further.

Finally, we trained a RandomForestRegressor from sklearn on this modified
data.

In order to implement domain adaptation using optimal transport, we trained
the entire model on a single country from the dataset, Angola, and received a
test MSE of 0.36. Next we used the sinkhorn transport method to optimally
transport the distribution of pixels from images from another country to the
distribution of pixels from images from Angola. Then, we would take these
transported images as input into the model previously described.

## Domain Adaptation
We use Sinkhorn Transport in order find the optimal transport between two distributions, in this case regions of satellite images. Let $$X_s$$ be the source distribution and $$X_t$$ be the target distribution where $$X_s\mathbb{1}_d = 1$$ and $$X_t\mathbb{1}_d = 1$$.

$$U(X_s, X_t) = \{P \in {R}_{+}^{d\times d} \| P{1}_d = Xs, P^T{1_d} = X_t\}$$.

Then we define the minimum shift between these distributions as:

$$d(X_s, X_t) = \min_{P\in U(X_s, X_t)} <P,C> - \frac{1}{\lambda}h(P)$$

Where $$P$$ is the transportation plan and $$C$$ is the cost matrix based on some distance metric $$d(X_{s_i}, X_{t_j})$$. $$\lambda$$ is defined to be some regularization constant and $$h(P)$$ is defined to be the entropy of the transport map. This addition of the entropy regularization term makes the problem strictly convex and quickly therefore convergent.
 
In our case we let the source distribution be satellite images of areas of the country Angola, and the target distribution to be satellite images of other countries in Africa (e.g. Benin). 

The optimal transport fails in this case as it adds a shift to the dataset which makes all of the decisions that the random forest classifier makes either one value i.e. there is not enough variation in the optimal transport, and not at the scale required to have the classifier work properly. In the case of Angola and Benin, we achieved an error rate of .48 with optimal transport and and .36 with no transport. We had similar results for many other pairs of countries.

## Discussion
After seeing results worse than our simple CNN, we are skeptical if optimal transport, or domain adaptation in general is a good fit for this problem. It seems that most countries follow a certain biome. i.e. rural areas are mostly one color, either green for forest or tan for desert, and urban areas are generally grey or any other colors. A simple CNN is able to make these inferences when given an input of multiples countries that span the different possible biomes.
