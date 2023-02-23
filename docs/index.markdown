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
paragraph containing a lot of text, yeah you heard that right a LOT. Like so much you cant even read it.


